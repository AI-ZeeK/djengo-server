import { NotificationService } from './notification.service';
import { UserAuthorizedRequest } from '../interfaces/user.interface';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getVapidPublicKey(): {
        publicKey: string | undefined;
    };
    subscribePush(body: any, req: UserAuthorizedRequest): Promise<{
        success: boolean;
    }>;
    testNotification(req: UserAuthorizedRequest): Promise<{
        success: boolean;
        message: string;
        successful?: undefined;
        failed?: undefined;
    } | {
        success: boolean;
        successful: number;
        failed: number;
        message?: undefined;
    }>;
    subscribeExpo(req: UserAuthorizedRequest, body: {
        token: string;
        platform: string;
    }): Promise<{
        success: boolean;
    }>;
}
