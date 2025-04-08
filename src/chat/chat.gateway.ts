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

@WebSocketGateway({ cors: true }) // Enable CORS for WebSocket connections
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private chatService: ChatService) {}

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
    await this.chatService.markMessagesAsRead(chat_id, user_id);

    // Send chat history to the client
    client.emit('chat_history', chatHistory);

    console.log(`User ${user_id} joined chat ${chat_id}`);
  }
  // Send a message to a chat
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { chat_id: string; user_id: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chat_id, user_id, content } = data;

    // Check if the user is a participant
    const isParticipant = await this.chatService.isParticipant(
      chat_id,
      user_id,
    );
    if (!isParticipant) {
      client.emit('error', 'You are not a participant of this chat');
      return;
    }

    // Save the message to the database
    const message = await this.chatService.sendMessage({
      chat_id,
      sender_id: user_id,
      content,
    });

    // Broadcast the message to all participants in the chat room
    this.server.to(chat_id).emit('new_message', message);

    console.log(`User ${user_id} sent a message to chat ${chat_id}`);
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
}
