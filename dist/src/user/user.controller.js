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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_guard_1 = require("../auth/user.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(req) {
        const user = await this.userService.findOne({
            user_id: req.user.user_id,
        });
        return user;
    }
    async fetchByEmail(email) {
        return this.userService.fetchByEmail({ email });
    }
    async getUserContacts(req, name) {
        return await this.userService.getUserContacts({ req, name });
    }
    async updateUser(req_user, data) {
        return await this.userService.updateUser({ req_user, data });
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user account details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the current user account information',
        schema: {
            type: 'object',
            properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('account'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Fetch user by email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user information if found',
        schema: {
            type: 'object',
            properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "fetchByEmail", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user contacts' }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        description: 'Filter contacts by name',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of user contacts',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    user_id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('contacts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserContacts", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User information updated successfully',
        schema: {
            type: 'object',
            properties: {
                user_id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, common_1.Patch)('update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map