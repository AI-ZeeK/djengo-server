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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const user_guard_1 = require("../auth/user.guard");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    getChats(req) {
        return this.chatService.getChats({ user_id: req.user.user_id });
    }
    getMessages(chat_id, req) {
        return this.chatService.getMessages({ chat_id, req_user: req });
    }
    async getLastMessage(chat_id, req) {
        return this.chatService.getLastMessage({ chat_id });
    }
    async getLastMessages(chat_ids, req) {
        const chatIdsArray = chat_ids.split(',');
        return this.chatService.getLastMessagesForChats(chatIdsArray);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('chats'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getChats", null);
__decorate([
    (0, common_1.Get)('messages/:chat_id'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Param)('chat_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('last-message/:chat_id'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Param)('chat_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getLastMessage", null);
__decorate([
    (0, common_1.Get)('last-messages'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Query)('chat_ids')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getLastMessages", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map