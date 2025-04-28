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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_main_1 = require("@internal/prisma-main");
const enum_1 = require("../../prisma/enum");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(where, include, sample_data) {
        try {
            const fileEntityType = await this.prisma.fileEntityType.findFirst({
                where: {
                    entity_type: enum_1.FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
                },
            });
            if (!fileEntityType) {
                return null;
            }
            const userData = await this.prisma.user.findUnique({
                where,
                include: {
                    user_roles: {
                        where: {
                            is_active: true,
                        },
                    },
                    user_companies: {
                        include: {
                            company: true,
                        },
                    },
                    ...include,
                },
            });
            if (!userData) {
                return null;
            }
            const address_entity = await this.prisma.addressEntity.findFirst({
                where: {
                    entity_type: enum_1.ADDRESS_TYPE_ENUM.USER_HOME,
                },
            });
            if (!address_entity) {
                return null;
            }
            let address = await this.prisma.address.findFirst({
                where: {
                    entity_id: userData.user_id,
                },
            });
            address = await this.prisma.address.findFirst({
                where: {
                    entity_id: userData.user_id,
                    entity_type_id: address_entity.entity_type_id,
                },
            });
            const avatarFile = await this.prisma.files.findFirst({
                where: {
                    entity_id: userData.user_id,
                    entity_type_id: fileEntityType.entity_type_id,
                },
            });
            return {
                ...userData,
                address,
                avatar_url: avatarFile?.file_url || null,
                user_role: Array.isArray(userData.user_roles) && userData.user_roles.length
                    ? userData.user_roles[0]
                    : null,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async fetchByEmail({ email }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (!user)
                return {
                    status: false,
                    message: 'User with email does not exist',
                    data: null,
                };
            return {
                status: true,
                message: 'User with email exists',
                data: user,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateUserStatus(user_id, is_online) {
        try {
            const user = await this.prisma.user.update({
                where: { user_id },
                data: { is_online },
            });
            return user;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUserContacts({ req, name, }) {
        try {
            const userContacts = await this.prisma.user.findMany({
                where: {
                    user_id: {
                        not: req.user.user_id,
                    },
                    ...(name
                        ? {
                            OR: [
                                { first_name: { contains: name, mode: 'insensitive' } },
                                { last_name: { contains: name, mode: 'insensitive' } },
                                { email: { contains: name, mode: 'insensitive' } },
                            ],
                        }
                        : undefined),
                },
                include: {
                    chat_participants: {
                        where: {
                            chat: {
                                chat_type: prisma_main_1.ChatType.DIRECT,
                            },
                            user_id: {
                                not: req.user.user_id,
                            },
                        },
                    },
                },
            });
            for (const contact of userContacts) {
                const fileEntityType = await this.prisma.fileEntityType.findFirst({
                    where: {
                        entity_type: enum_1.FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
                    },
                });
                if (!fileEntityType) {
                    continue;
                }
                const avatar = await this.prisma.files.findFirst({
                    where: {
                        entity_id: contact.user_id,
                        entity_type_id: fileEntityType.entity_type_id,
                    },
                });
                contact.avatar_url = avatar?.file_url || null;
            }
            return userContacts;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map