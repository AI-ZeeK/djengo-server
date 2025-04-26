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
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("./file.service");
const user_guard_1 = require("../auth/user.guard");
const supabase_service_1 = require("./supabase.service");
let FileController = class FileController {
    fileService;
    supabaseService;
    constructor(fileService, supabaseService) {
        this.fileService = fileService;
        this.supabaseService = supabaseService;
    }
    async uploadFile(file, req) {
        const userId = req.user.user_id;
        const fileType = file.mimetype.startsWith('image/') ? 'image' : 'audio';
        const fileUrl = await this.fileService.uploadFile(file, fileType, userId);
        return { url: fileUrl };
    }
    async uploadImageFile(file, req) {
        const userId = req.user.user_id;
        const fileUrl = await this.fileService.uploadFile(file, 'image', userId);
        return { url: fileUrl };
    }
    async uploadAudioFile(file, req) {
        const userId = req.user.user_id;
        const fileUrl = await this.fileService.uploadFile(file, 'audio', userId);
        return { url: fileUrl, duration: 0 };
    }
    async uploadBase64File(body, req) {
        const { file, type } = body;
        const userId = req.user.user_id;
        if (type === 'image' && !file.startsWith('data:image/')) {
            throw new Error('Invalid image format');
        }
        if (type === 'audio' && !file.startsWith('data:audio/')) {
            throw new Error('Invalid audio format');
        }
        const fileUrl = await this.fileService.uploadBase64File(file, type, userId);
        return { url: fileUrl };
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /(image|audio)\/.+/ }),
        ],
    }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('upload/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /image\/.+/ }),
        ],
    }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadImageFile", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('upload/audio'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
            new common_1.FileTypeValidator({ fileType: /audio\/.+/ }),
        ],
    }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadAudioFile", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('upload/base64'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadBase64File", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [file_service_1.FileService,
        supabase_service_1.SupabaseService])
], FileController);
//# sourceMappingURL=file.controller.js.map