import { ChatService } from './chat.service';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChats(req: UserAuthorizedRequest): Promise<any>;
    getMessages(chat_id: string, req: UserAuthorizedRequest): Promise<any>;
    getLastMessage(chat_id: string, req: UserAuthorizedRequest): Promise<any>;
    getLastMessages(chat_ids: string, req: UserAuthorizedRequest): Promise<{}>;
}
