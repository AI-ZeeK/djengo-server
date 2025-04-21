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

    // Remove user from active chats when they disconnect
    if (client.data.userId && client.data.activeChats) {
      for (const chatId of client.data.activeChats) {
        this.removeUserFromActiveChat(chatId, client.data.userId);
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

      // Type assertion to handle the 'any' type
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
    @MessageBody()
    data: {
      chat_id: string;
      content: string;
      type: string;
      sender_id: string;
      duration?: number;
    },
    @ConnectedSocket() client: Socket,
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

      this.server.to(chat_id).emit('new_message', message);

      for (const participant of participants) {
        if (participant.user_id === sender_id) continue;

        const isConnected = this.isUserConnected(participant.user_id);

        if (isConnected) {
          await this.chatService.updateStatus({
            message_id: message.message_id,
            to_status: MessageStatus.DELIVERED,
          });

          this.server.to(sender_id).emit('message_delivered', {
            message_id: message.message_id,
            chat_id,
            delivered_to: participant.user_id,
          });
        } else {
          console.log('SENDING  CHAT NOIFICATION');
          const chat_details = await this.chatService.getChatType({
            chat_id,
            user_id: participant.user_id,
          });
          await this.notificationService.sendChatNotification({
            chat_id,
            sender_id: participant.user_id,
            notification: {
              title: 'New Message',
              body: `You have a new ${chat_details?.chat_type.toLowerCase()} message from ${chat_details?.chat_name}`,
              data: {
                url: `/overview/chats/${chat_id}`,
              },
            },
          });
        }
      }

      // After saving the message, also notify users in their chat home rooms
      const chat = await this.chatService.getChatById(chat_id);

      if (chat) {
        // Get the last message to send in the update
        const lastMessage = await this.chatService.getLastMessage(chat_id);

        // For each participant, send an update to their chat home room
        for (const participant of chat.participants) {
          if (participant.user_id !== sender_id) {
            const chatHomeRoom = `chat_home:${participant.user_id}`;

            // Send the update to the user's chat home room
            this.server.to(chatHomeRoom).emit('chat_update', {
              type: 'new_message',
              chat_id: chat_id,
              message: lastMessage,
              chat: chat,
            });
          }
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

  @SubscribeMessage('join_chat_home')
  async handleJoinChatHome(
    @MessageBody() data: { user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { user_id } = data;

      // Join a room specific to this user's chat home
      const roomName = `chat_home:${user_id}`;
      await client.join(roomName);

      this.logger.log(`User ${user_id} joined chat home room: ${roomName}`);

      // Store the user's chat home room in the client data
      client.data.chatHomeRoom = roomName;

      // Get all chats for the user to initialize the view
      const chats = await this.chatService.getChats({ user_id });

      // Send the chats to the client
      client.emit('user_chats', chats);
    } catch (error) {
      this.logger.error(`Error joining chat home: ${error.message}`);
      client.emit('error', `Failed to join chat home: ${error.message}`);
    }
  }

  @SubscribeMessage('leave_chat_home')
  async handleLeaveChatHome(
    @MessageBody() data: { user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { user_id } = data;

      // Leave the chat home room
      const roomName = `chat_home:${user_id}`;
      await client.leave(roomName);

      this.logger.log(`User ${user_id} left chat home room: ${roomName}`);

      // Remove the chat home room from client data
      delete client.data.chatHomeRoom;
    } catch (error) {
      this.logger.error(`Error leaving chat home: ${error.message}`);
      client.emit('error', `Failed to leave chat home: ${error.message}`);
    }
  }
}
