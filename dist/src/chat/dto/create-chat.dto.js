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
exports.CreateChatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateChatDto {
    chat_type;
    name;
    chat_avatar;
    creator_id;
    participant_id;
    participant_ids;
}
exports.CreateChatDto = CreateChatDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ChatType,
        example: client_1.ChatType.GROUP,
    }),
    (0, class_validator_1.IsEnum)(client_1.ChatType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "chat_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'My Group Chat',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.chat_type === client_1.ChatType.GROUP),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'https://example.com/avatar.jpg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "chat_avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'user123',
        required: false,
        description: 'ID of the user creating the chat. Usually comes from authenticated user.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "creator_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        example: 'user456',
        required: false,
        description: 'Single participant ID for private chats',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.chat_type === client_1.ChatType.DIRECT),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatDto.prototype, "participant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['user1_id', 'user2_id'],
        description: 'Array of participant IDs for group chats',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.chat_type === client_1.ChatType.GROUP),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateChatDto.prototype, "participant_ids", void 0);
//# sourceMappingURL=create-chat.dto.js.map