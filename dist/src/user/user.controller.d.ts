import { UserService } from './user.service';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: UserAuthorizedRequest): Promise<any>;
    fetchByEmail(email: string): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    getUserContacts(req: UserAuthorizedRequest, name: string): Promise<any>;
}
