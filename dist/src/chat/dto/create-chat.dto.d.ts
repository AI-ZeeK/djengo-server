import { ChatType } from '@internal/prisma-main';
export declare class CreateChatDto {
    chat_type: ChatType;
    name: string;
    chat_avatar: string;
    creator_id: string;
    participant_id: string;
    participant_ids: string[];
}
