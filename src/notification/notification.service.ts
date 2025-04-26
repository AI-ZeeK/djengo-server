/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Initialize Web Push with VAPID keys
    webpush.setVapidDetails(
      `mailto:${this.configService.get<string>('VAPID_EMAIL')}`,
      this.configService.get<string>('VAPID_PUBLIC_KEY') || '',
      this.configService.get<string>('VAPID_PRIVATE_KEY') || '',
    );
  }

  /**
   * Save a push subscription for a user
   */
  async savePushSubscription(
    userId: string,
    subscription: webpush.PushSubscription,
    platform: 'WEB' | 'ANDROID' | 'IOS' = 'WEB',
  ) {
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

      this.logger.log(
        `Push subscription saved for user ${userId} on ${platform}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Error saving push subscription: ${error.message}`);
      throw new Error('Failed to save push subscription');
    }
  }

  /**
   * Register a push token for any platform
   */
  async registerPushToken(
    userId: string,
    token: string,
    platform: 'WEB' | 'ANDROID' | 'IOS',
    endpoint: string = token, // For web, endpoint is different from token
  ) {
    try {
      // Store in the PushSubscription table regardless of platform
      await this.prisma.pushSubscription.upsert({
        where: {
          user_id_endpoint: {
            user_id: userId,
            endpoint: endpoint,
          },
        },
        update: {
          p256dh: platform === 'WEB' ? token : null, // Only web uses p256dh
          auth: null, // Set as needed for web
          platform,
          updated_at: new Date(),
        },
        create: {
          user_id: userId,
          endpoint: endpoint,
          p256dh: platform === 'WEB' ? token : null,
          auth: null,
          platform,
        },
      });

      this.logger.log(
        `Push token registered for user ${userId} on ${platform}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Error registering push token: ${error.message}`);
      throw new Error('Failed to register push token');
    }
  }

  /**
   * Send a notification to a specific user on any platform
   */
  async sendNotificationToUser(
    userId: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
      icon?: string;
      badge?: string;
      tag?: string;
    },
  ) {
    try {
      const subscriptions = await this.prisma.pushSubscription.findMany({
        where: { user_id: userId },
      });

      if (!subscriptions.length) {
        this.logger.warn(`No push subscriptions found for user ${userId}`);
        return { success: false, message: 'No subscriptions found' };
      }

      const results = await Promise.allSettled(
        subscriptions.map(async (subscription) => {
          // Handle different platforms
          if (subscription.platform === 'WEB') {
            return this.sendWebPushNotification(subscription, notification);
          } else if (['ANDROID', 'IOS'].includes(subscription.platform)) {
            return this.sendExpoPushNotification(
              subscription.endpoint, // Use endpoint as the token
              notification.title,
              notification.body,
              notification.data,
            );
          }
        }),
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      this.logger.log(
        `Sent notifications to user ${userId}: ${successful} successful, ${failed} failed`,
      );
      return { success: true, successful, failed };
    } catch (error) {
      this.logger.error(
        `Error sending notification to user ${userId}: ${error.message}`,
      );
      throw new Error('Failed to send notification');
    }
  }

  /**
   * Send a notification to all participants of a chat
   */
  async sendChatNotification({
    chat_id,
    sender_id,
    notification,
  }: {
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
  }) {
    try {
      // Get all participants except the sender
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

      const results = await Promise.allSettled(
        participants.map(async (participant) => {
          return this.sendNotificationToUser(participant.user_id, notification);
        }),
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      this.logger.log(
        `Sent chat notifications for chat ${chat_id}: ${successful} successful, ${failed} failed`,
      );
      return { success: true, successful, failed };
    } catch (error) {
      this.logger.error(
        `Error sending chat notification for chat ${chat_id}: ${error.message}`,
      );
      throw new Error('Failed to send chat notification');
    }
  }

  /**
   * Send a web push notification
   */
  private async sendWebPushNotification(
    subscription: any,
    notification: {
      title: string;
      body: string;
      data?: Record<string, string>;
      icon?: string;
      badge?: string;
      tag?: string;
    },
  ) {
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
    } catch (error) {
      // Handle expired subscriptions
      if (error.statusCode === 410) {
        await this.prisma.pushSubscription.delete({
          where: {
            user_id_endpoint: {
              user_id: subscription.user_id,
              endpoint: subscription.endpoint,
            },
          },
        });
        this.logger.warn(
          `Deleted expired push subscription for user ${subscription.user_id}`,
        );
      } else {
        this.logger.error(`Error sending push notification: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Send an Expo push notification
   */
  private async sendExpoPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    try {
      // For Expo, we send directly to their API
      const messages = [
        {
          to: token,
          sound: 'default',
          title,
          body,
          data: data || {},
        },
      ];

      // Use Expo's push notification service
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const responseData = await response.json();
      this.logger.log(
        `Sent Expo push notification: ${JSON.stringify(responseData)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending Expo push notification: ${error.message}`,
      );
      throw error;
    }
  }
}
