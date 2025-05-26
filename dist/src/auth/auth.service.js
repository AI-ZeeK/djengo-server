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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const helpers_1 = require("../lib/helper/helpers");
const enum_1 = require("../../prisma/enum");
const user_service_1 = require("../user/user.service");
const client_1 = require("@prisma/client");
let AuthService = AuthService_1 = class AuthService {
    jwtService;
    prisma;
    mailService;
    userService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(jwtService, prisma, mailService, userService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.mailService = mailService;
        this.userService = userService;
    }
    async validateRefreshToken({ user_id, refresh_token, }) {
        try {
            const user = await this.prisma.user.findUnique({ where: { user_id } });
            if (!user || !user.refresh_token) {
                return null;
            }
            const isValid = await bcrypt.compare(refresh_token, user.refresh_token);
            if (!isValid) {
                return null;
            }
            const newAccessToken = this.generateAccessToken({
                user_id,
            });
            return {
                user_id: user.user_id,
                access_token: newAccessToken,
            };
        }
        catch (error) {
            console.error('Error validating refresh token:', error);
            return null;
        }
    }
    async generateAccessToken({ user_id }) {
        const payload = {
            user_id,
        };
        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
        await this.prisma.user.update({
            where: { user_id },
            data: {
                refresh_token: refresh_token,
            },
        });
        return { access_token };
    }
    generateAuthToken({ user_id }) {
        const payload = {
            user_id,
        };
        const auth_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '5m',
        });
        return { auth_token };
    }
    async initiateLogin({ email }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (!user)
                throw new common_1.NotFoundException();
            return this.generateAuthToken({ user_id: user.user_id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async initiateRegister({ email, role_name, }) {
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (user)
                throw new common_1.BadGatewayException('User Exists, Proceed to login');
            const role = await this.prisma.role.findUnique({
                where: {
                    role_name,
                },
            });
            if (!role)
                throw new common_1.NotFoundException('role type unavailable');
            user = await this.prisma.user.create({
                data: {
                    email,
                    user_roles: {
                        create: {
                            role_name,
                        },
                    },
                },
            });
            return this.generateAuthToken({ user_id: user.user_id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async register({ email, role_name, password, organization_name, company_ref, phone_number, organization_email, organization_registration_date, organization_phone_number, organization_registration_number, }) {
        try {
            const { user } = await this.prisma.$transaction(async (prisma) => {
                try {
                    let user = await prisma.user.findUnique({
                        where: {
                            email: email.toLowerCase(),
                        },
                    });
                    if (user)
                        throw new common_1.BadGatewayException('User Exists, Proceed to login');
                    const role = await prisma.role.findUnique({
                        where: {
                            role_name,
                        },
                    });
                    if (!role)
                        throw new common_1.NotFoundException('role unavailable');
                    const saltRounds = 10;
                    const hashed_password = await bcrypt.hash(password, saltRounds);
                    user = await prisma.user.create({
                        data: {
                            email: email.toLowerCase(),
                            password: hashed_password,
                            phone_number,
                            user_roles: {
                                create: {
                                    role_name: role.role_name,
                                    is_active: true,
                                },
                            },
                        },
                    });
                    if (enum_1.ROLES_ENUM.BUSINESS_USER === role.role_name) {
                        const organizaton = await prisma.organization.create({
                            data: {
                                name: organization_name,
                                phone_number: organization_phone_number,
                                email: organization_email,
                                registration_number: organization_registration_number,
                                registration_date: organization_registration_date,
                                creator: {
                                    connect: {
                                        user_id: user.user_id,
                                    },
                                },
                            },
                        });
                        await prisma.businessUser.create({
                            data: {
                                user_id: user.user_id,
                                organization_id: organizaton.organization_id,
                                access_type: client_1.BusinessAccessType.CREATOR,
                                access_level: 1,
                                is_active: true,
                            },
                        });
                    }
                    if (enum_1.ROLES_ENUM.STAFF === role.role_name) {
                        const company = await prisma.company.findUnique({
                            where: {
                                company_ref,
                            },
                        });
                        if (!company)
                            throw new common_1.NotFoundException('company not found');
                        await prisma.staff.create({
                            data: {
                                company_id: company?.company_id,
                                user_id: user.user_id,
                            },
                        });
                    }
                    const _user = await prisma.user.findUnique({
                        where: {
                            user_id: user.user_id,
                        },
                    });
                    return { user: _user };
                }
                catch (error) {
                    throw new common_1.BadRequestException(error.message);
                }
            });
            const { access_token } = await this.generateAccessToken({
                user_id: user.user_id,
            });
            return { user, access_token };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async validateCompanyReference(company_name) {
        try {
            const company_ref = helpers_1.Helpers.generateUniqueValue(company_name);
            const reference = await this.prisma.company.findUnique({
                where: {
                    company_ref,
                },
            });
            if (reference) {
                return await this.validateCompanyReference(company_name);
            }
            return company_ref;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async login({ email, password }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email.toLowerCase(),
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const { access_token } = await this.generateAccessToken({
                user_id: user.user_id,
            });
            const _user = await this.userService.findOne({
                user_id: user.user_id,
            });
            return { user: _user, access_token };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async logout({ user_id }) {
        try {
            await this.prisma.user.update({
                where: { user_id },
                data: { refresh_token: '' },
            });
            await this.prisma.pushSubscription.deleteMany({
                where: { user_id },
            });
            this.logger.log(`User ${user_id} logged out and push subscriptions cleared`);
            return { message: 'Logout successful' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async sendOtp({ token }) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    user_id: payload.user_id,
                },
            });
            if (!user)
                throw new common_1.NotFoundException('user for otp not active');
            const otp = helpers_1.Helpers.generateOTP({
                length: 5,
                options: {
                    numbers: true,
                },
            });
            await this.prisma.verification.create({
                data: {
                    user_id: payload.user_id,
                    otp_code: otp,
                    purpose: client_1.VerificationPurpose.EMAIL_VERIFICATION,
                    expires_at: helpers_1.Helpers.getFutureTimestamp({ seconds: 95 }),
                },
            });
            await this.mailService.sendBusinessOtpEmail({
                email: user?.email,
                name: user?.email?.split('@')[0],
                otp,
            });
            return {
                message: 'otp sent successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async refreshToken(user_id) {
        try {
            const refreshToken = await this.prisma.user.findUnique({
                where: { user_id },
                select: { refresh_token: true },
            });
            if (!refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const payload = await this.jwtService.verifyAsync(refreshToken.refresh_token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const user = await this.prisma.user.findUnique({
                where: { user_id: payload.user_id },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid user');
            }
            const { access_token } = await this.generateAccessToken({
                user_id: user.user_id,
            });
            return { user, access_token };
        }
        catch (error) {
            console.log('ERROR', error);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map