import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserGuard } from '../auth/user.guard';
import { UserAuthorizedRequest } from '../interfaces/user.interface';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
    };
  }

  @UseGuards(UserGuard)
  @Post('subscribe')
  async subscribePush(@Body() body: any, @Req() req: UserAuthorizedRequest) {
    try {
      const userId = req.user.user_id;
      const subscription = body.subscription;
      const platform = body.platform || 'WEB';

      return await this.notificationService.savePushSubscription(
        userId,
        subscription,
        platform,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to subscribe to push notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(UserGuard)
  @Post('test')
  async testNotification(@Req() req: UserAuthorizedRequest) {
    try {
      const userId = req.user.user_id;
      return await this.notificationService.sendNotificationToUser(userId, {
        title: 'Test Notification',
        body: 'This is a test notification from the server.',
        data: {
          url: '/overview',
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to send test notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
