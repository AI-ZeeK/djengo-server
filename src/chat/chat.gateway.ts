/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageType, MessageStatus } from '@internal/prisma-main';
import { Logger } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { UserService } from 'src/user/user.service';
import { SendMessageDto } from '../notification/dto/send-message.dto';

// Define a custom socket type that includes our custom data
interface ChatSocket extends Socket {
  data: {
    userId?: string;
    activeChats?: Set<string>;
    chatHomeRoom?: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  namespace: '/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  // Track active users in each chat
  private activeChatUsers: Map<string, Set<string>> = new Map();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  // Handle new WebSocket connections
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Handle WebSocket disconnections
  handleDisconnect(@ConnectedSocket() client: ChatSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Update user status to offline when they disconnect
    if (client.data.userId) {
      this.userService
        .updateUserStatus(client.data.userId, false)
        .then(() => {
          // Get all chats for this user
          return this.chatService.getChats({ user_id: client.data.userId! });
        })
        .then((userChats) => {
          // For each chat, notify other participants about status change
          for (const chat of userChats) {
            // Broadcast to all participants in this chat
            this.server.to(chat.chat_id).emit('user_status_update', {
              user_id: client.data.userId,
              status: 'offline',
              timestamp: new Date(),
            });
          }
        })
        .catch((error) => {
          this.logger.error(`Error updating offline status: ${error.message}`);
        });

      // Remove user from active chats when they disconnect
      if (client.data.activeChats) {
        for (const chatId of client.data.activeChats) {
          this.removeUserFromActiveChat(chatId, client.data.userId);
        }
      }
    }
  }

  // Helper method to add a user to the active users in a chat
  private addUserToActiveChat(chatId: string, userId: string) {
    if (!this.activeChatUsers.has(chatId)) {
      this.activeChatUsers.set(chatId, new Set());
    }
    this.activeChatUsers.get(chatId)!.add(userId);
    this.logger.debug(`User ${userId} added to active chat ${chatId}`);
  }

  // Helper method to remove a user from the active users in a chat
  private removeUserFromActiveChat(chatId: string, userId: string) {
    if (this.activeChatUsers.has(chatId)) {
      this.activeChatUsers.get(chatId)!.delete(userId);
      this.logger.debug(`User ${userId} removed from active chat ${chatId}`);
    }
  }

  // Helper method to check if a user is active in a chat
  private isUserActiveInChat(chatId: string, userId: string): boolean {
    if (!this.activeChatUsers.has(chatId)) {
      return false;
    }
    return this.activeChatUsers.get(chatId)!.has(userId);
  }

  // Join a chat room and send chat history
  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: ChatSocket,
  ) {
    const { chat_id, user_id } = data;

    try {
    // Check if the user is a participant
    const isParticipant = await this.chatService.isParticipant(
      chat_id,
      user_id,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not a participant of this chat');
      return;
    }

      // Join the socket to the chat room
    client.join(chat_id);

      // Store user ID and active chat in socket data
      client.data.userId = user_id;
      if (!client.data.activeChats) {
        // Initialize as a proper Set
        client.data.activeChats = new Set<string>();
      }

      const activeChats = client.data.activeChats as Set<string>;
      activeChats.add(chat_id);

      // Add user to active chat users
      this.addUserToActiveChat(chat_id, user_id);

    // Mark messages as read
    const readMessageIds = await this.chatService.markMessagesAsRead(
      chat_id,
      user_id,
    );

    if (readMessageIds.length > 0) {
      // Broadcast to all participants that messages have been read
      this.server.to(chat_id).emit('messages_read', {
        chat_id,
        user_id,
        message_ids: readMessageIds,
        read_at: new Date(),
      });
    }

      this.logger.log(`User ${user_id} joined chat ${chat_id}`);
    } catch (error) {
      this.logger.error(`Error joining chat: ${error.message}`);
      client.emit('error', `Failed to join chat: ${error.message}`);
    }
  }

  // Leave a chat room
  @SubscribeMessage('leave_chat')
  handleLeaveChat(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: ChatSocket,
  ) {
    const { chat_id, user_id } = data;

    // Leave the socket room
    client.leave(chat_id);

    // Remove from active chats in socket data
    if (client.data.activeChats) {
      client.data.activeChats.delete(chat_id);
    }

    // Remove from active chat users
    this.removeUserFromActiveChat(chat_id, user_id);

    this.logger.log(`User ${user_id} left chat ${chat_id}`);
  }

  // Send a message to a chat
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: SendMessageDto,
    @ConnectedSocket() client: ChatSocket,
  ) {
    try {
      const { chat_id, content, type, sender_id, duration } = data;

      let message = await this.chatService.sendMessage({
      chat_id,
      content,
        type: type as MessageType,
        sender_id,
        duration,
      });

      message = await this.chatService.updateStatus({
        message_id: message.message_id,
        to_status: MessageStatus.SENT,
      });

      const participants = await this.chatService.getParticipants({
        chat_id,
      });

      // Send the new message to everyone in the chat room
    this.server.to(chat_id).emit('new_message', message);

      // Get the chat details to include with updates
      const chat = await this.chatService.getChatById(chat_id);

      // After saving the message, send push notifications to all participants
      // except the sender
      const messageContent = content;
      const filteredParticipants = chat?.participants.filter(
        (p) => p.user_id !== data.sender_id,
      );
      if (filteredParticipants) {
        for (const participant of filteredParticipants) {
          // Send notification to user
          await this.notificationService.sendNotificationToUser(
            participant.user_id,
            {
              title: 'New Message',
              body: messageContent,
              data: {
                chat_id: data.chat_id,
                url: `/overview/chats/${data.chat_id}`,
              },
            },
          );
        }
      }

      this.logger.log(
        `Message sent to chat ${chat_id} by user ${sender_id}: ${content}`,
      );
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', `Failed to send message: ${error.message}`);
    }
  }

  // Helper method to check if a user is connected to any socket
  private isUserConnected(userId: string): boolean {
    try {
      // Safely check if the adapter and rooms exist
      if (
        !this.server ||
        !this.server.sockets ||
        !this.server.sockets.adapter
      ) {
        this.logger.warn(
          'Socket server, sockets, or adapter is not initialized',
        );
        return false;
      }

      // Check if the rooms Map exists
      if (!this.server.sockets.adapter.rooms) {
        this.logger.warn('Socket adapter rooms is not initialized');
        return false;
      }

      // Check if the user is in any room with their user ID
      const sockets = this.server.sockets.adapter.rooms.get(userId);
      return !!sockets && sockets.size > 0;
    } catch (error) {
      this.logger.error(
        `Error checking if user ${userId} is connected: ${error.message}`,
      );
      return false; // Default to false on error
    }
  }

  // Mark messages as read
  @SubscribeMessage('mark_messages_read')
  async handleMarkMessagesRead(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
    const { chat_id, user_id } = data;

      // Mark messages as read in the database
    const readMessageIds = await this.chatService.markMessagesAsRead(
      chat_id,
      user_id,
    );

    if (readMessageIds.length > 0) {
      // Broadcast to all participants that messages have been read
      this.server.to(chat_id).emit('messages_read', {
        chat_id,
        user_id,
        message_ids: readMessageIds,
        read_at: new Date(),
      });
    }

      this.logger.log(
        `User ${user_id} marked messages as read in chat ${chat_id}`,
      );
    } catch (error) {
      this.logger.error(`Error marking messages as read: ${error.message}`);
      client.emit('error', `Failed to mark messages as read: ${error.message}`);
    }
  }

  // Get user chats
  @SubscribeMessage('get_user_chats')
  async handleGetUserChats(
    @MessageBody() data: { user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { user_id } = data;

      // Get all chats for the user
      const chats = await this.chatService.getChats({ user_id });

      // Send the chats to the client
      client.emit('user_chats', chats);

      this.logger.log(`Sent chats to user ${user_id}`);
    } catch (error) {
      this.logger.error(`Error getting user chats: ${error.message}`);
      client.emit('error', `Failed to get chats: ${error.message}`);
    }
  }

  // Add these handlers to the ChatGateway class

  @SubscribeMessage('user_status')
  async handleUserStatus(
    @MessageBody() data: { status: 'online' | 'offline' },
    @ConnectedSocket() client: ChatSocket,
  ) {
    try {
      const userId = client.data.userId;
      if (!userId) {
        this.logger.error('Cannot update status: No user ID in socket data');
        return;
      }

      const status = data.status || 'online';

      // Update user status in database
      await this.userService.updateUserStatus(userId, status === 'online');

      // Get all chats for this user
      const userChats = await this.chatService.getChats({ user_id: userId });

      // For each chat, notify other participants about status change
      for (const chat of userChats) {
        // Broadcast to all participants in this chat
        this.server.to(chat.chat_id).emit('user_status_update', {
          user_id: userId,
          status: status,
          timestamp: new Date(),
        });
      }

      this.logger.log(`User ${userId} is now ${status}`);
    } catch (error) {
      this.logger.error(`Error updating user status: ${error.message}`);
      client.emit('error', `Failed to update status: ${error.message}`);
    }
  }
}
