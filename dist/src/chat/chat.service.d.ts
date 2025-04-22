import { PrismaService } from 'src/prisma/prisma.service';
import { Chat, ChatType, MessageStatus, MessageType } from '@internal/prisma-main';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { FileService } from '../file/file.service';
export declare class ChatService {
    private prisma;
    private fileService;
    private readonly logger;
    constructor(prisma: PrismaService, fileService: FileService);
    getChatHistory(chat_id: string): Promise<any>;
    getMessages({ chat_id, req_user, }: {
        chat_id: string;
        req_user: UserAuthorizedRequest;
    }): Promise<any>;
    getChats({ user_id }: {
        user_id: string;
    }): Promise<any>;
    isParticipant(chat_id: string, user_id: string): Promise<boolean>;
    leaveChat(chat_id: string, user_id: string): Promise<void>;
    sendMessage(data: {
        chat_id: string;
        sender_id: string;
        content: string;
        type: MessageType;
        duration?: number;
    }): Promise<any>;
    private isValidImageUrl;
    private isAudioFile;
    markMessagesAsRead(chat_id: string, user_id: string): Promise<any>;
    createDirectChat({ creator_id, participant_id, }: {
        creator_id: string;
        participant_id: string;
    }): Promise<Chat>;
    createGroupChat(creator_id: string, name: string, participant_ids: string[]): Promise<any>;
    getChatType({ chat_id, user_id }: {
        chat_id: string;
        user_id: any;
    }): Promise<{
        chat_type: any;
        chat_name: any;
    }>;
    getParticipants({ chat_id }: {
        chat_id: string;
    }): Promise<any>;
    updateMessageStatus({ recipient_id, from_status, to_status, }: {
        recipient_id: string;
        from_status: MessageStatus;
        to_status: MessageStatus;
    }): Promise<any>;
    updateStatus({ message_id, to_status, }: {
        message_id: string;
        to_status: MessageStatus;
    }): Promise<any>;
    getChat({ chat_id }: {
        chat_id: string;
    }): Promise<any>;
    getMessageStatus({ message_id }: {
        message_id: string;
    }): Promise<{
        message_id: any;
        status: any;
        read_receipts: any;
    }>;
    sendMessageWithFile(data: {
        chat_id: string;
        sender_id: string;
        content: string;
        type: MessageType;
        duration?: number;
    }): Promise<any>;
    createChat({ chat_type, creator_id, participant_ids, name, }: {
        chat_type: ChatType;
        creator_id: string;
        participant_ids: string[];
        name?: string;
    }): Promise<any>;
    getChatMessages(chat_id: string): Promise<any>;
    getLastMessage({ chat_id }: {
        chat_id: string;
    }): Promise<any>;
    getLastMessagesForChats(chat_ids: string[]): Promise<{}>;
    getChatById(chat_id: string): Promise<any>;
}
