import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from 'src/user/user.service';
interface ChatSocket extends Socket {
    data: {
        userId?: string;
        activeChats?: Set<string>;
        chatHomeRoom?: string;
    };
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private userService;
    private notificationService;
    server: Server;
    private readonly logger;
    private activeChatUsers;
    constructor(chatService: ChatService, userService: UserService, notificationService: NotificationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: ChatSocket): void;
    private addUserToActiveChat;
    private removeUserFromActiveChat;
    private isUserActiveInChat;
    handleJoinChat(data: {
        chat_id: string;
        user_id: string;
    }, client: ChatSocket): Promise<void>;
    handleLeaveChat(data: {
        chat_id: string;
        user_id: string;
    }, client: ChatSocket): void;
    handleSendMessage(data: {
        chat_id: string;
        content: string;
        type: string;
        sender_id: string;
        duration?: number;
    }, client: Socket): Promise<void>;
    private isUserConnected;
    handleMarkMessagesRead(data: {
        chat_id: string;
        user_id: string;
    }, client: Socket): Promise<void>;
    handleGetUserChats(data: {
        user_id: string;
    }, client: Socket): Promise<void>;
    handleUserStatus(data: {
        status: 'online' | 'offline';
    }, client: ChatSocket): Promise<void>;
}
export {};
