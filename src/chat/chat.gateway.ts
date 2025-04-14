/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
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

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  namespace: '/',
}) // Enable CORS for WebSocket connections
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chatService: ChatService) {}
  // async handleConnection(client: Socket) {
  //   try {
  //     // Get token from handshake auth
  //     const token = client.handshake.auth?.token;

  //     if (!token) {
  //       client.disconnect();
  //       return;
  //     }

  //     // Verify token
  //     const payload = await this.jwtService.verifyAsync(token, {
  //       secret: process.env.JWT_ACCESS_SECRET,
  //     });

  //     // Store user ID in socket data
  //     client.data.userId = payload.user_id;

  //     // Join user to their own room for private messages
  //     client.join(payload.user_id);

  //     console.log(`Client connected: ${client.id}, User: ${payload.user_id}`);
  //   } catch (error) {
  //     console.error('Socket authentication error:', error);
  //     client.disconnect();
  //   }
  // }
  // Handle new WebSocket connections
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle WebSocket disconnections
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Join a chat room and send chat history
  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, user_id } = data;

    // Check if the user is a participant
    const isParticipant = await this.chatService.isParticipant(
      chat_id,
      user_id,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not a participant of this chat');
      return;
    }

    // Join the chat room
    client.join(chat_id);

    // Fetch chat history
    const chatHistory = await this.chatService.getChatHistory(chat_id);

    // Send chat history to the client
    client.emit('chat_history', chatHistory);

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

    console.log(`User ${user_id} joined chat ${chat_id}`);
  }

  // Send a message to a chat
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: { chat_id: string; content: string; type: string; sender_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, content, type, sender_id } = data;

    try {
      // Create the message with initial status SENT
      let message = await this.chatService.sendMessage({
        chat_id,
        content,
        type: type as MessageType,
        sender_id,
      });

      message = await this.chatService.updateStatus({
        message_id: message.message_id,
        to_status: MessageStatus.SENT,
      });

      // Broadcast the message to all participants in the chat room
      this.server.to(chat_id).emit('new_message', message);

      // Check if any recipients are online and update status to DELIVERED
      try {
        const participants = await this.chatService.getParticipants(chat_id);

        // Safely check if rooms exists before filtering
        if (this.server && this.server.sockets && this.server.sockets.adapter) {
          const onlineParticipants = participants
            .filter((p) => p.user_id !== sender_id) // Exclude sender
            .filter((p) => {
              // Check if this participant is connected
              const sockets = this.server.sockets.adapter.rooms?.get(p.user_id);
              return sockets && sockets.size > 0;
            });

          // If any recipients are online, update status to DELIVERED
          if (onlineParticipants && onlineParticipants.length > 0) {
            for (const participant of onlineParticipants) {
              await this.chatService.updateMessageStatus({
                recipient_id: participant.user_id,
                from_status: MessageStatus.SENT,
                to_status: MessageStatus.DELIVERED,
              });
            }

            // Notify sender that message was delivered
            this.server.to(sender_id).emit('message_status_updated', {
              message_id: message.message_id,
              chat_id,
              status: MessageStatus.DELIVERED,
              updated_at: new Date(),
            });
          }
        } else {
          // If we can't check online status, just log it
          this.logger.warn(
            'Could not check online status - socket adapter not available',
          );
        }
      } catch (error) {
        // Log the error but don't fail the whole message send operation
        this.logger.error(`Error checking online status: ${error.message}`);
      }

      console.log(`User ${sender_id} sent a message to chat ${chat_id}`);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', 'Failed to send message');
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, user_id } = data;

    // Remove the user from the chat participants
    await this.chatService.leaveChat(chat_id, user_id);

    // Leave the WebSocket room
    client.leave(chat_id);

    console.log(`User ${user_id} left chat ${chat_id}`);
  }

  // Add a new message handler for marking messages as read
  @SubscribeMessage('mark_messages_read')
  async handleMarkMessagesRead(
    @MessageBody() data: { chat_id: string; user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, user_id } = data;

    // Check if the user is a participant
    const isParticipant = await this.chatService.isParticipant(
      chat_id,
      user_id,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not a participant of this chat');
      return;
    }

    try {
      // Mark messages as read
      const readMessageIds = await this.chatService.markMessagesAsRead(
        chat_id,
        user_id,
      );

      if (readMessageIds.length > 0) {
        // Get the messages with their updated status
        const messagesWithStatus = await Promise.all(
          readMessageIds.map(async (messageId) => {
            return await this.chatService.getMessageStatus(messageId);
          }),
        );

        // Broadcast to all participants that messages have been read
        this.server.to(chat_id).emit('messages_read', {
          chat_id,
          user_id,
          message_ids: readMessageIds,
          read_at: new Date(),
          messages: messagesWithStatus,
        });

        // Also emit individual status updates for each message
        messagesWithStatus.forEach((message) => {
          this.server.to(chat_id).emit('message_status_updated', {
            message_id: message.message_id,
            chat_id,
            status: message.status,
            updated_at: new Date(),
          });
        });
      }

      console.log(`User ${user_id} marked messages as read in chat ${chat_id}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      client.emit('error', 'Failed to mark messages as read');
    }
  }

  // Add handlers for creating new chats
  // get creator id from request token
  // get participant id from client data

  @SubscribeMessage('create_direct_chat')
  async handleCreateDirectChat(
    @MessageBody() data: { creator_id: string; participant_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('create_direct_chat', data);

    const { creator_id, participant_id } = data;

    try {
      // Create the direct chat
      const chat = await this.chatService.createDirectChat({
        creator_id,
        participant_id,
      });

      // Join the chat room
      client.join(chat.chat_id);

      // Notify the other user if they're online
      this.server.to(participant_id).emit('new_chat', chat);

      // Send the chat to the creator
      client.emit('new_chat', chat);

      console.log(
        `Direct chat created between ${creator_id} and ${participant_id}`,
      );
      return chat;
    } catch (error) {
      client.emit('error', 'Failed to create direct chat');
      console.error('Error creating direct chat:', error);
    }
  }

  @SubscribeMessage('create_group_chat')
  async handleCreateGroupChat(
    @MessageBody()
    data: { creator_id: string; name: string; participant_ids: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { creator_id, name, participant_ids } = data;

    try {
      // Create the group chat
      const chat = await this.chatService.createGroupChat(
        creator_id,
        name,
        participant_ids,
      );

      // Join the chat room
      client.join(chat.chat_id);

      // Notify all participants
      participant_ids.forEach((userId) => {
        if (userId !== creator_id) {
          this.server.to(userId).emit('new_chat', chat);
        }
      });

      // Send the chat to the creator
      client.emit('new_chat', chat);

      console.log(`Group chat "${name}" created by ${creator_id}`);
      return chat;
    } catch (error) {
      client.emit('error', 'Failed to create group chat');
      console.error('Error creating group chat:', error);
    }
  }

  @SubscribeMessage('get_user_chats')
  async handleGetUserMessages(
    @MessageBody() data: { user_id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { user_id } = data;

    try {
      const chats = await this.chatService.getChats({ user_id });
      client.emit('user_chats', chats);

      this.logger.log(`Sent all messages to user ${user_id}`);
    } catch (error) {
      this.logger.error(`Error getting user messages: ${error.message}`);
      client.emit('error', 'Failed to get user messages');
    }
  }

  @SubscribeMessage('update_message_status')
  async handleUpdateMessageStatus(
    @MessageBody()
    data: {
      user_id: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { user_id } = data;

    try {
      // Update message status in the database
      const updatedMessageIds = await this.chatService.updateMessageStatus({
        recipient_id: user_id,
        from_status: MessageStatus.SENT,
        to_status: MessageStatus.DELIVERED,
      });

      if (updatedMessageIds.length > 0) {
        // Notify senders that their messages have been delivered
        updatedMessageIds.forEach(({ message_id, chat_id, sender_id }) => {
          this.server.to(sender_id).emit('message_status_updated', {
            message_id,
            chat_id,
            status: MessageStatus.DELIVERED,
            updated_at: new Date(),
          });
        });

        this.logger.log(
          `Updated ${updatedMessageIds.length} messages to ${MessageStatus.DELIVERED} for user ${user_id}`,
        );
      }
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      client.emit('error', 'Failed to update message status');
    }
  }
}
