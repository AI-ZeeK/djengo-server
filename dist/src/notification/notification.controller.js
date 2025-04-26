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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("./notification.service");
const user_guard_1 = require("../auth/user.guard");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getVapidPublicKey() {
        return {
            publicKey: process.env.VAPID_PUBLIC_KEY,
        };
    }
    async subscribePush(body, req) {
        try {
            const userId = req.user.user_id;
            const subscription = body.subscription;
            const platform = body.platform || 'WEB';
            return await this.notificationService.savePushSubscription(userId, subscription, platform);
        }
        catch (error) {
            throw new common_1.HttpException('Failed to subscribe to push notifications', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async testNotification(req) {
        try {
            const userId = req.user.user_id;
            return await this.notificationService.sendNotificationToUser(userId, {
                title: 'Test Notification',
                body: 'This is a test notification from the server.',
                data: {
                    url: '/overview',
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException('Failed to send test notification', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async subscribeExpo(req, body) {
        try {
            const userId = req.user.user_id;
            await this.notificationService.registerPushToken(userId, body.token, body.platform, body.token);
            return { success: true };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to register push token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)('vapid-public-key'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "getVapidPublicKey", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "subscribePush", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "testNotification", null);
__decorate([
    (0, common_1.Post)('subscribe-expo'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "subscribeExpo", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map