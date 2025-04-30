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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_main_1 = require("@internal/prisma-main");
const file_service_1 = require("../file/file.service");
let ChatService = ChatService_1 = class ChatService {
    prisma;
    fileService;
    logger = new common_1.Logger(ChatService_1.name);
    constructor(prisma, fileService) {
        this.prisma = prisma;
        this.fileService = fileService;
    }
    async getChatHistory(chat_id) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    chat_id,
                },
                include: {
                    messages: {
                        orderBy: {
                            created_at: 'asc',
                        },
                        include: {
                            sender: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                            read_receipts: {
                                include: {
                                    user: {
                                        select: {
                                            user_id: true,
                                            first_name: true,
                                            last_name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    participants: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!chat) {
                throw new Error('Chat not found');
            }
            const messagesWithReadReceipts = chat.messages.map((message) => {
                const readBy = message.read_receipts.map((read) => ({
                    user_id: read.user.user_id,
                    name: `${read.user.first_name} ${read.user.last_name}`.trim(),
                    read_at: read.read_at,
                }));
                return {
                    ...message,
                    read_receipts: readBy,
                };
            });
            return {
                ...chat,
                messages: messagesWithReadReceipts,
            };
        }
        catch (error) {
            this.logger.error(`Error getting chat history: ${error.message}`);
            throw new Error('Failed to get chat history');
        }
    }
    async getMessages({ chat_id, req_user, }) {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    chat_id,
                },
                include: {
                    read_receipts: {
                        where: {
                            user_id: {
                                not: req_user.user.user_id,
                            },
                        },
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'asc',
                },
            });
            return messages;
        }
        catch (error) {
            this.logger.error(`Error getting messages: ${error.message}`);
            throw new common_1.BadRequestException('Failed to get messages');
        }
    }
    async getChats({ user_id }) {
        console.log('Getting chats for user_id', user_id);
        try {
            const chats = await this.prisma.chat.findMany({
                where: {
                    participants: {
                        some: {
                            user_id,
                        },
                    },
                },
                include: {
                    participants: {
                        where: {
                            user_id: {
                                not: user_id,
                            },
                        },
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    messages: {
                        orderBy: {
                            created_at: 'desc',
                        },
                        take: 1,
                    },
                    unread_message_counts: {
                        where: {
                            user_id,
                        },
                    },
                },
                orderBy: {
                    updated_at: 'desc',
                },
            });
            const formattedChats = chats.map((chat) => {
                let name = chat.name;
                if (chat.chat_type === 'DIRECT') {
                    const otherParticipant = chat.participants.find((p) => p.user_id !== user_id);
                    if (otherParticipant) {
                        const user = otherParticipant.user;
                        name = `${user.first_name} ${user.last_name}`.trim();
                    }
                }
                const unreadCount = chat.unread_message_counts[0]?.count || 0;
                return {
                    ...chat,
                    name,
                    unread_count: unreadCount,
                };
            });
            return formattedChats;
        }
        catch (error) {
            this.logger.error(`Error getting chats: ${error.message}`);
            throw new Error('Failed to get chats');
        }
    }
    async isParticipant(chat_id, user_id) {
        const participant = await this.prisma.chatParticipant.findUnique({
            where: {
                chat_id_user_id: {
                    chat_id,
                    user_id,
                },
            },
        });
        return !!participant;
    }
    async leaveChat(chat_id, user_id) {
        await this.prisma.chatParticipant.deleteMany({
            where: {
                chat_id,
                user_id,
            },
        });
    }
    async sendMessage(data) {
        try {
            const { chat_id, sender_id, content, type, duration, media_urls = [], } = data;
            let times = 0;
            for (const media_url of media_urls) {
                if (type === prisma_main_1.MessageType.IMAGE && !this.isValidImageUrl(media_url)) {
                    throw new common_1.BadRequestException('Invalid image URL or format');
                }
            }
            if (type === prisma_main_1.MessageType.AUDIO && !this.isAudioFile(content)) {
                throw new common_1.BadRequestException('Invalid audio content');
            }
            const message = await this.prisma.message.create({
                data: {
                    chat_id,
                    sender_id,
                    content,
                    type,
                    status: prisma_main_1.MessageStatus.SENT,
                    media_urls,
                    duration: type === prisma_main_1.MessageType.AUDIO ? duration || 0 : undefined,
                },
                include: {
                    sender: true,
                },
            });
            await this.prisma.chatParticipant.updateMany({
                where: {
                    chat_id,
                    user_id: { not: sender_id },
                },
                data: {
                    unread_count: { increment: 1 },
                },
            });
            return message;
        }
        catch (error) {
            this.logger.error(`Error sending message: ${error.message}`);
            throw new Error('Failed to send message');
        }
    }
    isValidImageUrl(url) {
        try {
            const parsedUrl = new URL(url);
            const path = parsedUrl.pathname.toLowerCase();
            return (path.endsWith('.jpg') ||
                path.endsWith('.jpeg') ||
                path.endsWith('.png') ||
                path.endsWith('.gif') ||
                path.endsWith('.webp') ||
                path.endsWith('.svg'));
        }
        catch {
            return url.startsWith('data:image/');
        }
    }
    isAudioFile(path) {
        const hasAudioExtension = path.endsWith('.mp3') ||
            path.endsWith('.wav') ||
            path.endsWith('.ogg') ||
            path.endsWith('.webm') ||
            path.endsWith('.m4a');
        const isSupabaseAudio = path.includes('supabase') && path.includes('/audio/');
        return hasAudioExtension || isSupabaseAudio;
    }
    async markMessagesAsRead(chat_id, user_id) {
        const messages = await this.prisma.message.findMany({
            where: {
                chat_id,
                sender_id: {
                    not: user_id,
                },
                status: {
                    in: [prisma_main_1.MessageStatus.SENT, prisma_main_1.MessageStatus.DELIVERED],
                },
            },
            select: {
                message_id: true,
                sender_id: true,
            },
        });
        if (messages.length === 0) {
            return [];
        }
        await this.prisma.message.updateMany({
            where: {
                message_id: {
                    in: messages.map((m) => m.message_id),
                },
            },
            data: {
                status: prisma_main_1.MessageStatus.READ,
            },
        });
        return messages.map((m) => ({
            message_id: m.message_id,
            sender_id: m.sender_id,
        }));
    }
    async createDirectChat({ creator_id, participant_id, }) {
        try {
            console.log('CREATOR_ID', creator_id);
            console.log('participant_id', participant_id);
            if (!participant_id || !creator_id)
                throw new common_1.BadRequestException('Chat Create constrainsts not met');
            console.log('CREATOR_ID', creator_id);
            console.log('participant_id', participant_id);
            const existingChat = await this.prisma.chat.findFirst({
                where: {
                    chat_type: prisma_main_1.ChatType.DIRECT,
                    participants: {
                        every: {
                            user_id: {
                                in: [creator_id, participant_id],
                            },
                        },
                    },
                },
                include: {
                    participants: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            if (existingChat) {
                return existingChat;
            }
            const newChat = await this.prisma.chat.create({
                data: {
                    chat_type: 'DIRECT',
                },
                select: {
                    chat_id: true,
                },
            });
            const participant = await this.prisma.chatParticipant.upsert({
                where: {
                    chat_id_user_id: {
                        chat_id: newChat.chat_id,
                        user_id: creator_id,
                    },
                },
                update: {
                    is_admin: true,
                },
                create: {
                    chat_id: newChat.chat_id,
                    user_id: creator_id,
                    is_admin: true,
                },
            });
            const participant2 = await this.prisma.chatParticipant.upsert({
                where: {
                    chat_id_user_id: {
                        chat_id: newChat.chat_id,
                        user_id: participant_id,
                    },
                },
                update: {
                    is_admin: true,
                },
                create: {
                    chat_id: newChat.chat_id,
                    user_id: participant_id,
                    is_admin: true,
                },
            });
            console.log('newChat', newChat);
            console.log('participant', participant);
            console.log('participant2', participant2);
            const chat = await this.prisma.chat.findFirst({
                where: {
                    chat_id: newChat.chat_id,
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            return chat;
        }
        catch (error) {
            this.logger.error(`Error creating direct chat: ${error.message}`);
            throw new Error('Failed to create direct chat');
        }
    }
    async createGroupChat({ creator_id, name, participant_ids, chat_avatar, }) {
        return this.createChat({
            chat_type: prisma_main_1.ChatType.GROUP,
            creator_id,
            participant_ids,
            name,
            chat_avatar,
        });
    }
    async getChatType({ chat_id, user_id }) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    chat_id,
                },
                include: {
                    participants: {
                        where: {
                            user_id,
                        },
                        include: {
                            user: true,
                        },
                    },
                },
            });
            if (!chat)
                throw new common_1.NotFoundException();
            const chat_name = chat.chat_type === 'DIRECT'
                ? chat.participants[0]?.user?.first_name
                    ? `${chat.participants[0]?.user?.first_name} ${chat.participants[0]?.user?.last_name}`
                    : chat.participants[0]?.user?.email ||
                        chat.participants[0]?.user?.phone_number
                : chat?.name;
            return {
                chat_type: chat.chat_type,
                chat_name,
            };
        }
        catch (error) {
            this.logger.error(`Error updating message status: ${error.message}`);
            throw new Error('Failed to update message status');
        }
    }
    async getParticipants({ chat_id }) {
        const participants = await this.prisma.chatParticipant.findMany({
            where: {
                chat_id,
            },
            include: {
                user: true,
            },
        });
        return participants;
    }
    async updateMessageStatus({ recipient_id, from_status, to_status, }) {
        try {
            const chats = await this.prisma.chat.findMany({
                where: {
                    participants: {
                        some: {
                            user_id: recipient_id,
                        },
                    },
                },
                select: {
                    chat_id: true,
                },
            });
            const chatIds = chats.map((chat) => chat.chat_id);
            const messages = await this.prisma.message.findMany({
                where: {
                    chat_id: {
                        in: chatIds,
                    },
                    sender_id: {
                        not: recipient_id,
                    },
                    status: from_status,
                },
                select: {
                    message_id: true,
                    chat_id: true,
                    sender_id: true,
                },
            });
            if (messages.length > 0) {
                await this.prisma.message.updateMany({
                    where: {
                        message_id: {
                            in: messages.map((m) => m.message_id),
                        },
                    },
                    data: {
                        status: to_status,
                    },
                });
            }
            return messages;
        }
        catch (error) {
            this.logger.error(`Error updating message status: ${error.message}`);
            throw new Error('Failed to update message status');
        }
    }
    async updateStatus({ message_id, to_status, }) {
        try {
            const message = await this.prisma.message.update({
                where: {
                    message_id: message_id,
                },
                data: {
                    status: to_status,
                },
                include: {
                    sender: true,
                },
            });
            return message;
        }
        catch (error) {
            this.logger.error(`Error updating message status: ${error.message}`);
            throw new Error('Failed to update message status');
        }
    }
    async getChat({ chat_id }) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    chat_id,
                },
                include: {
                    participants: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            return chat;
        }
        catch (error) {
            this.logger.error(`Error getting chat: ${error.message}`);
            throw new Error('Failed to get chat');
        }
    }
    async getMessageStatus({ message_id }) {
        try {
            const message = await this.prisma.message.findUnique({
                where: {
                    message_id,
                },
                include: {
                    read_receipts: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!message) {
                throw new Error('Message not found');
            }
            let status = message.status;
            if (message.read_receipts.length > 0) {
                status = prisma_main_1.MessageStatus.DELIVERED;
            }
            return {
                message_id: message.message_id,
                status,
                read_receipts: message.read_receipts,
            };
        }
        catch (error) {
            this.logger.error(`Error getting message status: ${error.message}`);
            throw new Error('Failed to get message status');
        }
    }
    async sendMessageWithFile(data) {
        const { chat_id, sender_id, content, type, duration } = data;
        let finalContent = content;
        if (type === prisma_main_1.MessageType.IMAGE && content.startsWith('data:image/')) {
            finalContent = await this.fileService.uploadBase64File(content, 'image', sender_id);
        }
        if (type === prisma_main_1.MessageType.AUDIO && content.startsWith('data:audio/')) {
            finalContent = await this.fileService.uploadBase64File(content, 'audio', sender_id);
        }
        const messageData = {
            chat_id,
            sender_id,
            content: finalContent,
            type,
            status: prisma_main_1.MessageStatus.SENT,
        };
        if (type === prisma_main_1.MessageType.AUDIO && duration) {
            messageData.duration = duration;
        }
        const message = await this.prisma.message.create({
            data: messageData,
            include: {
                sender: true,
            },
        });
        await this.prisma.chatParticipant.updateMany({
            where: {
                chat_id,
                user_id: { not: sender_id },
            },
            data: {
                unread_count: { increment: 1 },
            },
        });
        return message;
    }
    async createChat({ chat_type, creator_id, participant_ids, name, chat_avatar = '', }) {
        try {
            this.logger.log(`Creating chat with type ${chat_type} and ${participant_ids.length} participants`);
            const creator = await this.prisma.user.findUnique({
                where: { user_id: creator_id },
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            });
            if (!participant_ids.includes(creator_id)) {
                participant_ids.push(creator_id);
            }
            const uniqueParticipantIds = [...new Set(participant_ids)];
            this.logger.log(`Creating chat with ${uniqueParticipantIds.length} unique participants`);
            const newChat = await this.prisma.chat.create({
                data: {
                    chat_type,
                    name,
                    avatar_url: chat_avatar,
                    participants: {
                        create: uniqueParticipantIds.map((user_id) => ({
                            user_id,
                        })),
                    },
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            const creatorName = creator?.first_name && creator?.last_name
                ? `${creator.first_name} ${creator.last_name}`
                : creator?.email || 'Unknown user';
            const systemMessage = chat_type === prisma_main_1.ChatType.GROUP
                ? `Group "${name}" created by ${creatorName}`
                : `Chat created by ${creatorName}`;
            await this.prisma.message.create({
                data: {
                    chat_id: newChat.chat_id,
                    sender_id: 'system',
                    content: systemMessage,
                    type: prisma_main_1.MessageType.SYSTEM,
                    status: prisma_main_1.MessageStatus.SENT,
                },
            });
            this.logger.log(`Created chat ${newChat.chat_id} with ${newChat.participants.length} participants`);
            return newChat;
        }
        catch (error) {
            this.logger.error(`Error creating chat: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to create chat: ${error.message}`);
        }
    }
    async getChatMessages(chat_id) {
        return this.prisma.message.findMany({
            where: {
                chat_id,
            },
            orderBy: {
                created_at: 'asc',
            },
            include: {
                sender: {
                    select: {
                        user_id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async getLastMessage({ chat_id }) {
        try {
            const message = await this.prisma.message.findFirst({
                where: {
                    chat_id,
                },
                orderBy: {
                    created_at: 'desc',
                },
                include: {
                    sender: {
                        select: {
                            user_id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                        },
                    },
                },
            });
            return message;
        }
        catch (error) {
            this.logger.error(`Error getting last message: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to get last message: ${error.message}`);
        }
    }
    async getLastMessagesForChats(chat_ids) {
        try {
            const lastMessages = await Promise.all(chat_ids.map(async (chat_id) => {
                const message = await this.getLastMessage({ chat_id });
                return { chat_id, message };
            }));
            const lastMessagesMap = lastMessages.reduce((acc, { chat_id, message }) => {
                acc[chat_id] = message;
                return acc;
            }, {});
            return lastMessagesMap;
        }
        catch (error) {
            this.logger.error(`Error getting last messages: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to get last messages: ${error.message}`);
        }
    }
    async getChatById(chat_id) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    chat_id,
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    messages: {
                        take: 1,
                        orderBy: {
                            created_at: 'desc',
                        },
                        include: {
                            sender: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            return chat;
        }
        catch (error) {
            this.logger.error(`Error getting chat by ID: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to get chat: ${error.message}`);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_service_1.FileService])
], ChatService);
//# sourceMappingURL=chat.service.js.map