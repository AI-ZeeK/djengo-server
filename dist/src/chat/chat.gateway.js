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
var ChatGateway_1;
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const prisma_main_1 = require("@internal/prisma-main");
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification/notification.service");
const user_service_1 = require("../user/user.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    chatService;
    userService;
    notificationService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    activeChatUsers = new Map();
    constructor(chatService, userService, notificationService) {
        this.chatService = chatService;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        if (client.data.userId) {
            this.userService
                .updateUserStatus(client.data.userId, false)
                .then(() => {
                return this.chatService.getChats({ user_id: client.data.userId });
            })
                .then((userChats) => {
                for (const chat of userChats) {
                    this.server.to(chat.chat_id).emit('user_status_update', {
                        user_id: client.data.userId,
                        status: 'offline',
                        timestamp: new Date(),
                    });
                }
            })
                .catch((error) => {
                this.logger.error(`Error updating offline status: ${error.message}`);
            });
            if (client.data.activeChats) {
                for (const chatId of client.data.activeChats) {
                    this.removeUserFromActiveChat(chatId, client.data.userId);
                }
            }
        }
    }
    addUserToActiveChat(chatId, userId) {
        if (!this.activeChatUsers.has(chatId)) {
            this.activeChatUsers.set(chatId, new Set());
        }
        this.activeChatUsers.get(chatId).add(userId);
        this.logger.debug(`User ${userId} added to active chat ${chatId}`);
    }
    removeUserFromActiveChat(chatId, userId) {
        if (this.activeChatUsers.has(chatId)) {
            this.activeChatUsers.get(chatId).delete(userId);
            this.logger.debug(`User ${userId} removed from active chat ${chatId}`);
        }
    }
    isUserActiveInChat(chatId, userId) {
        if (!this.activeChatUsers.has(chatId)) {
            return false;
        }
        return this.activeChatUsers.get(chatId).has(userId);
    }
    async handleJoinChat(data, client) {
        const { chat_id, user_id } = data;
        try {
            const isParticipant = await this.chatService.isParticipant(chat_id, user_id);
            if (!isParticipant) {
                client.emit('error', 'You are not a participant of this chat');
                return;
            }
            client.join(chat_id);
            client.data.userId = user_id;
            if (!client.data.activeChats) {
                client.data.activeChats = new Set();
            }
            const activeChats = client.data.activeChats;
            activeChats.add(chat_id);
            this.addUserToActiveChat(chat_id, user_id);
            const readMessageIds = await this.chatService.markMessagesAsRead(chat_id, user_id);
            if (readMessageIds.length > 0) {
                this.server.to(chat_id).emit('messages_read', {
                    chat_id,
                    user_id,
                    message_ids: readMessageIds,
                    read_at: new Date(),
                });
            }
            this.logger.log(`User ${user_id} joined chat ${chat_id}`);
        }
        catch (error) {
            this.logger.error(`Error joining chat: ${error.message}`);
            client.emit('error', `Failed to join chat: ${error.message}`);
        }
    }
    handleLeaveChat(data, client) {
        const { chat_id, user_id } = data;
        client.leave(chat_id);
        if (client.data.activeChats) {
            client.data.activeChats.delete(chat_id);
        }
        this.removeUserFromActiveChat(chat_id, user_id);
        this.logger.log(`User ${user_id} left chat ${chat_id}`);
    }
    async handleSendMessage(data, client) {
        try {
            const { chat_id, content, type, sender_id, duration } = data;
            let message = await this.chatService.sendMessage({
                chat_id,
                content,
                type: type,
                sender_id,
                duration,
            });
            message = await this.chatService.updateStatus({
                message_id: message.message_id,
                to_status: prisma_main_1.MessageStatus.SENT,
            });
            const participants = await this.chatService.getParticipants({
                chat_id,
            });
            this.server.to(chat_id).emit('new_message', message);
            const chat = await this.chatService.getChatById(chat_id);
            for (const participant of participants) {
                if (participant.user_id === sender_id)
                    continue;
                const isConnected = this.isUserConnected(participant.user_id);
                if (isConnected) {
                    await this.chatService.updateStatus({
                        message_id: message.message_id,
                        to_status: prisma_main_1.MessageStatus.DELIVERED,
                    });
                    this.server.to(sender_id).emit('message_delivered', {
                        message_id: message.message_id,
                        chat_id,
                        delivered_to: participant.user_id,
                    });
                    this.server.to(participant.user_id).emit('chat_update', {
                        type: 'new_message',
                        chat_id: chat_id,
                        message: message,
                        chat: chat,
                    });
                }
                else {
                    console.log('SENDING CHAT NOTIFICATION');
                    const chat_details = await this.chatService.getChatType({
                        chat_id,
                        user_id: participant.user_id,
                    });
                    await this.notificationService.sendChatNotification({
                        chat_id,
                        sender_id: participant.user_id,
                        notification: {
                            title: 'New Message',
                            body: `You have a new ${chat_details?.chat_type.toLowerCase()} message from ${chat_details?.chat_name}`,
                            data: {
                                url: `/overview/chats/${chat_id}`,
                            },
                        },
                    });
                }
            }
            this.logger.log(`Message sent to chat ${chat_id} by user ${sender_id}: ${content}`);
        }
        catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            client.emit('error', `Failed to send message: ${error.message}`);
        }
    }
    isUserConnected(userId) {
        try {
            if (!this.server ||
                !this.server.sockets ||
                !this.server.sockets.adapter) {
                this.logger.warn('Socket server, sockets, or adapter is not initialized');
                return false;
            }
            if (!this.server.sockets.adapter.rooms) {
                this.logger.warn('Socket adapter rooms is not initialized');
                return false;
            }
            const sockets = this.server.sockets.adapter.rooms.get(userId);
            return !!sockets && sockets.size > 0;
        }
        catch (error) {
            this.logger.error(`Error checking if user ${userId} is connected: ${error.message}`);
            return false;
        }
    }
    async handleMarkMessagesRead(data, client) {
        try {
            const { chat_id, user_id } = data;
            const readMessageIds = await this.chatService.markMessagesAsRead(chat_id, user_id);
            if (readMessageIds.length > 0) {
                this.server.to(chat_id).emit('messages_read', {
                    chat_id,
                    user_id,
                    message_ids: readMessageIds,
                    read_at: new Date(),
                });
            }
            this.logger.log(`User ${user_id} marked messages as read in chat ${chat_id}`);
        }
        catch (error) {
            this.logger.error(`Error marking messages as read: ${error.message}`);
            client.emit('error', `Failed to mark messages as read: ${error.message}`);
        }
    }
    async handleGetUserChats(data, client) {
        try {
            const { user_id } = data;
            const chats = await this.chatService.getChats({ user_id });
            client.emit('user_chats', chats);
            this.logger.log(`Sent chats to user ${user_id}`);
        }
        catch (error) {
            this.logger.error(`Error getting user chats: ${error.message}`);
            client.emit('error', `Failed to get chats: ${error.message}`);
        }
    }
    async handleUserStatus(data, client) {
        try {
            const userId = client.data.userId;
            if (!userId) {
                this.logger.error('Cannot update status: No user ID in socket data');
                return;
            }
            const status = data.status || 'online';
            await this.userService.updateUserStatus(userId, status === 'online');
            const userChats = await this.chatService.getChats({ user_id: userId });
            for (const chat of userChats) {
                this.server.to(chat.chat_id).emit('user_status_update', {
                    user_id: userId,
                    status: status,
                    timestamp: new Date(),
                });
            }
            this.logger.log(`User ${userId} is now ${status}`);
        }
        catch (error) {
            this.logger.error(`Error updating user status: ${error.message}`);
            client.emit('error', `Failed to update status: ${error.message}`);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_messages_read'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkMessagesRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_user_chats'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetUserChats", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('user_status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleUserStatus", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5000',
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_service_1.UserService,
        notification_service_1.NotificationService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map