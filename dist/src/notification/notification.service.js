"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const webpush = require("web-push");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = NotificationService_1 = class NotificationService {
    configService;
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        webpush.setVapidDetails(`mailto:${this.configService.get('VAPID_EMAIL')}`, this.configService.get('VAPID_PUBLIC_KEY') || '', this.configService.get('VAPID_PRIVATE_KEY') || '');
    }
    async savePushSubscription(userId, subscription, platform = 'WEB') {
        try {
            await this.prisma.pushSubscription.upsert({
                where: {
                    user_id_endpoint: {
                        user_id: userId,
                        endpoint: subscription.endpoint,
                    },
                },
                update: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                    platform,
                    updated_at: new Date(),
                },
                create: {
                    user_id: userId,
                    endpoint: subscription.endpoint,
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                    platform,
                },
            });
            this.logger.log(`Push subscription saved for user ${userId} on ${platform}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Error saving push subscription: ${error.message}`);
            throw new Error('Failed to save push subscription');
        }
    }
    async sendNotificationToUser(userId, notification) {
        try {
            const subscriptions = await this.prisma.pushSubscription.findMany({
                where: { user_id: userId },
            });
            if (!subscriptions.length) {
                this.logger.warn(`No push subscriptions found for user ${userId}`);
                return { success: false, message: 'No subscriptions found' };
            }
            const results = await Promise.allSettled(subscriptions.map(async (subscription) => {
                return this.sendPushNotification(subscription, notification);
            }));
            const successful = results.filter((r) => r.status === 'fulfilled').length;
            const failed = results.filter((r) => r.status === 'rejected').length;
            this.logger.log(`Sent notifications to user ${userId}: ${successful} successful, ${failed} failed`);
            return { success: true, successful, failed };
        }
        catch (error) {
            this.logger.error(`Error sending notification to user ${userId}: ${error.message}`);
            throw new Error('Failed to send notification');
        }
    }
    async sendChatNotification({ chat_id, sender_id, notification, }) {
        try {
            const participants = await this.prisma.chatParticipant.findMany({
                where: {
                    chat_id: chat_id,
                    user_id: { not: sender_id },
                },
                select: {
                    user_id: true,
                },
            });
            if (!participants.length) {
                this.logger.warn(`No other participants found for chat ${chat_id}`);
                return { success: false, message: 'No other participants found' };
            }
            const results = await Promise.allSettled(participants.map(async (participant) => {
                return this.sendNotificationToUser(participant.user_id, notification);
            }));
            const successful = results.filter((r) => r.status === 'fulfilled').length;
            const failed = results.filter((r) => r.status === 'rejected').length;
            this.logger.log(`Sent chat notifications for chat ${chat_id}: ${successful} successful, ${failed} failed`);
            return { success: true, successful, failed };
        }
        catch (error) {
            this.logger.error(`Error sending chat notification for chat ${chat_id}: ${error.message}`);
            throw new Error('Failed to send chat notification');
        }
    }
    async sendPushNotification(subscription, notification) {
        try {
            const webPushSubscription = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth,
                },
            };
            const payload = JSON.stringify({
                title: notification.title,
                body: notification.body,
                icon: notification.icon || '/icon-192x192.png',
                badge: notification.badge || '/badge.png',
                tag: notification.tag || 'default',
                data: notification.data || {},
            });
            await webpush.sendNotification(webPushSubscription, payload);
            return { success: true };
        }
        catch (error) {
            if (error.statusCode === 410) {
                await this.prisma.pushSubscription.delete({
                    where: {
                        user_id_endpoint: {
                            user_id: subscription.user_id,
                            endpoint: subscription.endpoint,
                        },
                    },
                });
                this.logger.warn(`Deleted expired push subscription for user ${subscription.user_id}`);
            }
            else {
                this.logger.error(`Error sending push notification: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map