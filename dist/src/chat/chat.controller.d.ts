import { ChatService } from './chat.service';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createChat(createChatDto: CreateChatDto, req: UserAuthorizedRequest): Promise<{
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        name: string | null;
        chat_id: string;
        status: import(".prisma/client").$Enums.ChatStatus;
        avatar_url: string | null;
        chat_type: import(".prisma/client").$Enums.ChatType;
    } | {
        message: string;
    }>;
    getChats(req: UserAuthorizedRequest): Promise<{
        name: string | null;
        unread_count: number;
        unread_message_counts: {
            user_id: string;
            chat_id: string;
            count: number;
            last_read_at: Date;
        }[];
        messages: {
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            file_url: string | null;
            file_type: string | null;
            file_size: number | null;
            message_id: string;
            chat_id: string;
            sender_id: string;
            content: string;
            media_urls: string[];
            type: import(".prisma/client").$Enums.MessageType;
            status: import(".prisma/client").$Enums.MessageStatus;
            duration: number | null;
        }[];
        participants: ({
            user: {
                email: string;
                user_id: string;
                first_name: string | null;
                last_name: string | null;
            };
        } & {
            is_active: boolean;
            user_id: string;
            chat_id: string;
            joined_at: Date;
            is_admin: boolean;
            left_at: Date | null;
            unread_count: number;
        })[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        chat_id: string;
        status: import(".prisma/client").$Enums.ChatStatus;
        avatar_url: string | null;
        chat_type: import(".prisma/client").$Enums.ChatType;
    }[]>;
    getMessages(chat_id: string, req: UserAuthorizedRequest): Promise<({
        read_receipts: ({
            user: {
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                email: string;
                user_id: string;
                first_name: string | null;
                last_name: string | null;
                password: string | null;
                date_of_birth: Date;
                phone_number: string | null;
                backup_phone_number: string | null;
                email_verified: boolean | null;
                phone_verified: boolean | null;
                kyc_verified: boolean | null;
                is_blocked: boolean | null;
                fcm_token: string;
                refresh_token: string;
                last_seen: string;
                account_type: import(".prisma/client").$Enums.AccountType;
                permission_level: number;
            };
        } & {
            user_id: string;
            message_id: string;
            read_at: Date | null;
        })[];
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        file_url: string | null;
        file_type: string | null;
        file_size: number | null;
        message_id: string;
        chat_id: string;
        sender_id: string;
        content: string;
        media_urls: string[];
        type: import(".prisma/client").$Enums.MessageType;
        status: import(".prisma/client").$Enums.MessageStatus;
        duration: number | null;
    })[]>;
    getLastMessage(chat_id: string, req: UserAuthorizedRequest): Promise<({
        sender: {
            email: string;
            user_id: string;
            first_name: string | null;
            last_name: string | null;
        };
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        file_url: string | null;
        file_type: string | null;
        file_size: number | null;
        message_id: string;
        chat_id: string;
        sender_id: string;
        content: string;
        media_urls: string[];
        type: import(".prisma/client").$Enums.MessageType;
        status: import(".prisma/client").$Enums.MessageStatus;
        duration: number | null;
    }) | null>;
    getLastMessages(chat_ids: string, req: UserAuthorizedRequest): Promise<{}>;
}
