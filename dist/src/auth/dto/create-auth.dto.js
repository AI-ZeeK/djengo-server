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
exports.RefreshTokenDto = exports.LogoutDto = exports.SendOtpDto = exports.LoginDto = exports.RegisterDto = exports.InitiateRegisterDto = exports.InitiateLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const enum_1 = require("../../../prisma/enum");
const match_decorator_1 = require("../../decorators/match.decorator");
class InitiateLoginDto {
    email;
}
exports.InitiateLoginDto = InitiateLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitiateLoginDto.prototype, "email", void 0);
class InitiateRegisterDto {
    email;
    role_name;
}
exports.InitiateRegisterDto = InitiateRegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitiateRegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'number',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateRegisterDto.prototype, "role_name", void 0);
class RegisterDto {
    email;
    phone_number;
    role_name;
    password;
    confirm_password;
    organization_name;
    organization_email;
    organization_phone_number;
    organization_registration_number;
    organization_registration_date;
    company_ref;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: '1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'CLIENT',
        enum: enum_1.ROLES_ENUM,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(enum_1.ROLES_ENUM),
    __metadata("design:type", String)
], RegisterDto.prototype, "role_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'password123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'password123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, match_decorator_1.Match)('password'),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirm_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'My Company',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.BUSINESS_USER),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "organization_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'mycompany@email.com',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.BUSINESS_USER),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "organization_email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: '1234567890',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.BUSINESS_USER),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "organization_phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: '1234567890',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.BUSINESS_USER),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "organization_registration_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: '2021-01-01',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.BUSINESS_USER),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "organization_registration_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 123,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.role_name === enum_1.ROLES_ENUM.STAFF),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "company_ref", void 0);
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'password123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class SendOtpDto {
    token;
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "token", void 0);
class LogoutDto {
    user_id;
}
exports.LogoutDto = LogoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'email@email.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogoutDto.prototype, "user_id", void 0);
class RefreshTokenDto {
    user_id;
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'refresh_token',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "user_id", void 0);
//# sourceMappingURL=create-auth.dto.js.map