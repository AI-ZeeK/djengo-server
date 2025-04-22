import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private configService;
    private prisma;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    savePushSubscription(userId: string, subscription: webpush.PushSubscription, platform?: 'WEB' | 'ANDROID' | 'IOS'): Promise<{
        success: boolean;
    }>;
    sendNotificationToUser(userId: string, notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
        icon?: string;
        badge?: string;
        tag?: string;
    }): Promise<{
        success: boolean;
        message: string;
        successful?: undefined;
        failed?: undefined;
    } | {
        success: boolean;
        successful: any;
        failed: any;
        message?: undefined;
    }>;
    sendChatNotification({ chat_id, sender_id, notification, }: {
        chat_id: string;
        sender_id: string;
        notification: {
            title: string;
            body: string;
            data?: Record<string, string>;
            icon?: string;
            badge?: string;
            tag?: string;
        };
    }): Promise<{
        success: boolean;
        message: string;
        successful?: undefined;
        failed?: undefined;
    } | {
        success: boolean;
        successful: any;
        failed: any;
        message?: undefined;
    }>;
    private sendPushNotification;
}
