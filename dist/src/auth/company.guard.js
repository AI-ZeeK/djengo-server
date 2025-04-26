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
exports.CompanyAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let CompanyAuthGuard = class CompanyAuthGuard {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = request.cookies?.access_token;
        if (!token) {
            throw new common_1.UnauthorizedException('No access token provided');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });
            if (!payload.company_id) {
                throw new common_1.UnauthorizedException('Company ID is required');
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    user_id: payload.user_id,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid user ID');
            }
            const company = await this.prisma.company.findUnique({
                where: {
                    company_id: payload.company_id,
                },
            });
            if (!company) {
                throw new common_1.UnauthorizedException('Invalid company ID');
            }
            request['user'] = {
                user_id: payload.user_id,
                company_id: payload.company_id,
            };
            const newToken = await this.jwtService.signAsync({ user_id: payload.user_id, company_id: payload.company_id }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: process.env.JWT_ACCESS_EXPIRATION,
            });
            response.cookie('access_token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return true;
    }
};
exports.CompanyAuthGuard = CompanyAuthGuard;
exports.CompanyAuthGuard = CompanyAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], CompanyAuthGuard);
//# sourceMappingURL=company.guard.js.map