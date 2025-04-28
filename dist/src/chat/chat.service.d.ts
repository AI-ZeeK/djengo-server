import { PrismaService } from 'src/prisma/prisma.service';
import { Chat, ChatType, MessageStatus, MessageType } from '@internal/prisma-main';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { FileService } from '../file/file.service';
export declare class ChatService {
    private prisma;
    private fileService;
    private readonly logger;
    constructor(prisma: PrismaService, fileService: FileService);
    getChatHistory(chat_id: string): Promise<{
        messages: {
            read_receipts: {
                user_id: string;
                name: string;
                read_at: Date | null;
            }[];
            sender: {
                email: string;
                user_id: string;
                first_name: string | null;
                last_name: string | null;
            };
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
            type: import("@internal/prisma-main").$Enums.MessageType;
            status: import("@internal/prisma-main").$Enums.MessageStatus;
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
        name: string | null;
        chat_id: string;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }>;
    getMessages({ chat_id, req_user, }: {
        chat_id: string;
        req_user: UserAuthorizedRequest;
    }): Promise<({
        read_receipts: ({
            user: {
                created_at: Date | null;
                updated_at: Date | null;
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
                is_online: boolean | null;
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    })[]>;
    getChats({ user_id }: {
        user_id: string;
    }): Promise<{
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
            type: import("@internal/prisma-main").$Enums.MessageType;
            status: import("@internal/prisma-main").$Enums.MessageStatus;
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
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }[]>;
    isParticipant(chat_id: string, user_id: string): Promise<boolean>;
    leaveChat(chat_id: string, user_id: string): Promise<void>;
    sendMessage(data: {
        chat_id: string;
        sender_id: string;
        content: string;
        type: MessageType;
        media_urls: string[];
        duration?: number;
    }): Promise<{
        sender: {
            created_at: Date | null;
            updated_at: Date | null;
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
            is_online: boolean | null;
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    }>;
    private isValidImageUrl;
    private isAudioFile;
    markMessagesAsRead(chat_id: string, user_id: string): Promise<{
        message_id: string;
        sender_id: string;
    }[]>;
    createDirectChat({ creator_id, participant_id, }: {
        creator_id: string;
        participant_id: string;
    }): Promise<Chat>;
    createGroupChat(creator_id: string, name: string, participant_ids: string[]): Promise<{
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
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        name: string | null;
        chat_id: string;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }>;
    getChatType({ chat_id, user_id }: {
        chat_id: string;
        user_id: any;
    }): Promise<{
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
        chat_name: string | null;
    }>;
    getParticipants({ chat_id }: {
        chat_id: string;
    }): Promise<({
        user: {
            created_at: Date | null;
            updated_at: Date | null;
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
            is_online: boolean | null;
        };
    } & {
        is_active: boolean;
        user_id: string;
        chat_id: string;
        joined_at: Date;
        is_admin: boolean;
        left_at: Date | null;
        unread_count: number;
    })[]>;
    updateMessageStatus({ recipient_id, from_status, to_status, }: {
        recipient_id: string;
        from_status: MessageStatus;
        to_status: MessageStatus;
    }): Promise<{
        message_id: string;
        chat_id: string;
        sender_id: string;
    }[]>;
    updateStatus({ message_id, to_status, }: {
        message_id: string;
        to_status: MessageStatus;
    }): Promise<{
        sender: {
            created_at: Date | null;
            updated_at: Date | null;
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
            is_online: boolean | null;
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    }>;
    getChat({ chat_id }: {
        chat_id: string;
    }): Promise<({
        participants: ({
            user: {
                created_at: Date | null;
                updated_at: Date | null;
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
                is_online: boolean | null;
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
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        name: string | null;
        chat_id: string;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }) | null>;
    getMessageStatus({ message_id }: {
        message_id: string;
    }): Promise<{
        message_id: string;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        read_receipts: ({
            user: {
                user_id: string;
                first_name: string | null;
                last_name: string | null;
            };
        } & {
            user_id: string;
            message_id: string;
            read_at: Date | null;
        })[];
    }>;
    sendMessageWithFile(data: {
        chat_id: string;
        sender_id: string;
        content: string;
        type: MessageType;
        duration?: number;
    }): Promise<{
        sender: {
            created_at: Date | null;
            updated_at: Date | null;
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
            is_online: boolean | null;
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    }>;
    createChat({ chat_type, creator_id, participant_ids, name, }: {
        chat_type: ChatType;
        creator_id: string;
        participant_ids: string[];
        name?: string;
    }): Promise<{
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
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        name: string | null;
        chat_id: string;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }>;
    getChatMessages(chat_id: string): Promise<({
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    })[]>;
    getLastMessage({ chat_id }: {
        chat_id: string;
    }): Promise<({
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
        type: import("@internal/prisma-main").$Enums.MessageType;
        status: import("@internal/prisma-main").$Enums.MessageStatus;
        duration: number | null;
    }) | null>;
    getLastMessagesForChats(chat_ids: string[]): Promise<{}>;
    getChatById(chat_id: string): Promise<({
        messages: ({
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
            type: import("@internal/prisma-main").$Enums.MessageType;
            status: import("@internal/prisma-main").$Enums.MessageStatus;
            duration: number | null;
        })[];
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
    } & {
        created_at: Date;
        updated_at: Date;
        deleted_at: Date | null;
        name: string | null;
        chat_id: string;
        status: import("@internal/prisma-main").$Enums.ChatStatus;
        chat_type: import("@internal/prisma-main").$Enums.ChatType;
    }) | null>;
}
