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
var FileService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let FileService = FileService_1 = class FileService {
    configService;
    logger = new common_1.Logger(FileService_1.name);
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadFile(file, fileType, userId) {
        try {
            if (fileType === 'image' && !file.mimetype.startsWith('image/')) {
                throw new common_1.BadRequestException('Invalid image format');
            }
            if (fileType === 'audio' && !file.mimetype.startsWith('audio/')) {
                throw new common_1.BadRequestException('Invalid audio format');
            }
            const folder = `djengo/${fileType}s/${userId}`;
            const stream = new stream_1.Readable();
            stream.push(file.buffer);
            stream.push(null);
            const resource_type = fileType === 'audio' ? 'video' : 'image';
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    resource_type,
                    overwrite: true,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    if (!result?.secure_url) {
                        reject(new Error('Failed to get secure URL from upload'));
                        return;
                    }
                    resolve(result.secure_url);
                    this.logger.log(`File uploaded successfully: ${result?.secure_url}`);
                });
                stream.pipe(uploadStream);
            });
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to upload file: ${error.message}`);
        }
    }
    async uploadBase64File(base64Data, fileType, userId) {
        try {
            const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new common_1.BadRequestException('Invalid base64 data');
            }
            const contentType = matches[1];
            if (fileType === 'image' && !contentType.startsWith('image/')) {
                throw new common_1.BadRequestException('Invalid image format');
            }
            if (fileType === 'audio' && !contentType.startsWith('audio/')) {
                throw new common_1.BadRequestException('Invalid audio format');
            }
            const folder = `djengo/${fileType}s/${userId}`;
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload(base64Data, {
                    folder,
                    resource_type: fileType === 'audio' ? 'video' : 'image',
                    overwrite: true,
                }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
            });
            this.logger.log(`File uploaded successfully: ${uploadResult.secure_url}`);
            return uploadResult.secure_url;
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to upload file: ${error.message}`);
        }
    }
    async deleteFile(fileUrl) {
        try {
            const urlParts = fileUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            const folderPath = urlParts
                .slice(urlParts.indexOf('djengo'), urlParts.length - 1)
                .join('/');
            const fullPublicId = `${folderPath}/${publicId}`;
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.destroy(fullPublicId, { resource_type: fileUrl.includes('/audio/') ? 'video' : 'image' }, (error, result) => {
                    if (error)
                        return reject(error);
                    resolve(result);
                });
            });
            this.logger.log(`File deleted successfully: ${fullPublicId}`);
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`);
            throw new common_1.BadRequestException(`Failed to delete file: ${error.message}`);
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], FileService);
//# sourceMappingURL=file.service.js.map