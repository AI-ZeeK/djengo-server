import { ChatService } from './chat.service';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChat(createChatDto: CreateChatDto, req: UserAuthorizedRequest): Promise<{
        chat_id: string;
        name: string | null;
        avatar_url: string | null;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
    } | {
        message: string;
    }>;
    getChats(req: UserAuthorizedRequest): Promise<{
        name: string | null;
        unread_count: number;
        messages: {
            chat_id: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            status: import("@internal/prisma-main").$Enums.MessageStatus;
            message_id: string;
            sender_id: string;
            content: string;
            media_urls: string[];
            type: import("@internal/prisma-main").$Enums.MessageType;
            duration: number | null;
            file_url: string | null;
            file_size: number | null;
            file_type: string | null;
        }[];
        participants: ({
            user: {
                user_id: string;
                first_name: string | null;
                last_name: string | null;
                email: string;
            };
        } & {
            chat_id: string;
            user_id: string;
            joined_at: Date;
            is_admin: boolean;
            is_active: boolean;
            left_at: Date | null;
            unread_count: number;
        })[];
        unread_message_counts: {
            chat_id: string;
            user_id: string;
            count: number;
            last_read_at: Date;
        }[];
        chat_id: string;
        avatar_url: string | null;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
    }[]>;
    getMessages(chat_id: string, req: UserAuthorizedRequest): Promise<({
        read_receipts: ({
            user: {
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                user_id: string;
                first_name: string | null;
                last_name: string | null;
                password: string | null;
                date_of_birth: Date;
                email: string;
                phone_number: string | null;
                backup_phone_number: string | null;
                email_verified: boolean | null;
                phone_verified: boolean | null;
                kyc_verified: boolean | null;
                is_blocked: boolean | null;
                fcm_token: string;
                refresh_token: string;
                last_seen: string;
            };
        } & {
            user_id: string;
            message_id: string;
            read_at: Date | null;
        })[];
    } & {
        chat_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        message_id: string;
        sender_id: string;
        content: string;
        media_urls: string[];
        type: import("@internal/prisma-main").$Enums.MessageType;
        duration: number | null;
        file_url: string | null;
        file_size: number | null;
        file_type: string | null;
    })[]>;
    getLastMessage(chat_id: string, req: UserAuthorizedRequest): Promise<({
        sender: {
            user_id: string;
            first_name: string | null;
            last_name: string | null;
            email: string;
        };
    } & {
        chat_id: string;
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        message_id: string;
        sender_id: string;
        content: string;
        media_urls: string[];
        type: import("@internal/prisma-main").$Enums.MessageType;
        duration: number | null;
        file_url: string | null;
        file_size: number | null;
        file_type: string | null;
    }) | null>;
    getLastMessages(chat_ids: string, req: UserAuthorizedRequest): Promise<{}>;
}
