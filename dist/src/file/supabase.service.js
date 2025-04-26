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
var SupabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = SupabaseService_1 = class SupabaseService {
    configService;
    logger = new common_1.Logger(SupabaseService_1.name);
    supabase;
    bucketName = 'djengo-audio-uploads';
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseServiceKey = this.configService.get('SUPABASE_SERVICE_KEY');
        if (!supabaseUrl || !supabaseServiceKey) {
            this.logger.error('Missing Supabase configuration');
            return;
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
        this.ensureBucketExists().catch((err) => {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            this.logger.error(`Failed to ensure bucket exists: ${errorMessage}`);
        });
        this.logger.log('Supabase client initialized');
    }
    async uploadFile(file, fileType, userId) {
        try {
            if (fileType === 'image' && !file.mimetype.startsWith('image/')) {
                throw new Error('Invalid image format');
            }
            if (fileType === 'audio' && !file.mimetype.startsWith('audio/')) {
                throw new Error('Invalid audio format');
            }
            await this.verifyBucketAccess();
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = `${fileType}/${fileName}`;
            const { data, error } = await this.supabase.storage
                .from('djengo-audio-uploads')
                .upload(filePath, file.buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype,
            });
            if (error) {
                throw new Error(`Error uploading file: ${error?.message || 'Unknown error'}`);
            }
            const { data: urlData } = this.supabase.storage
                .from('djengo-audio-uploads')
                .getPublicUrl(filePath);
            this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
            return urlData.publicUrl;
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error?.message || 'Unknown error'}`);
            throw error;
        }
    }
    async uploadBase64File(base64Data, fileType, userId) {
        try {
            const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 data');
            }
            const contentType = matches[1];
            const base64 = matches[2];
            if (fileType === 'image' && !contentType.startsWith('image/')) {
                throw new Error('Invalid image format');
            }
            if (fileType === 'audio' && !contentType.startsWith('audio/')) {
                throw new Error('Invalid audio format');
            }
            const buffer = Buffer.from(base64, 'base64');
            const fileExt = contentType.split('/')[1];
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = `${fileType}/${fileName}`;
            const { data, error } = await this.supabase.storage
                .from('djengo-audio-uploads')
                .upload(filePath, buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType,
            });
            if (error) {
                throw new Error(`Error uploading file: ${error?.message || 'Unknown error'}`);
            }
            const { data: urlData } = this.supabase.storage
                .from('djengo-audio-uploads')
                .getPublicUrl(filePath);
            this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
            return urlData.publicUrl;
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error?.message || 'Unknown error'}`);
            throw error;
        }
    }
    async deleteFile(fileUrl) {
        try {
            const urlObj = new URL(fileUrl);
            const pathParts = urlObj.pathname.split('/');
            const bucketIndex = pathParts.findIndex((part) => part === 'djengo-audio-uploads');
            if (bucketIndex === -1) {
                throw new Error('Invalid file URL');
            }
            const filePath = pathParts.slice(bucketIndex + 1).join('/');
            const { error } = await this.supabase.storage
                .from('djengo-audio-uploads')
                .remove([filePath]);
            if (error) {
                throw new Error(`Error deleting file: ${error?.message || 'Unknown error'}`);
            }
            this.logger.log(`File deleted successfully: ${filePath}`);
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error?.message || 'Unknown error'}`);
            throw error;
        }
    }
    async ensureBucketExists() {
        try {
            const { data: buckets } = await this.supabase.storage.listBuckets();
            const bucketExists = buckets?.some((bucket) => bucket.name === 'djengo-audio-uploads');
            if (!bucketExists) {
                this.logger.warn('Bucket "djengo-audio-uploads" does not exist. Please create it manually in the Supabase dashboard.');
            }
            else {
                this.logger.log('Bucket "djengo-audio-uploads" exists');
            }
        }
        catch (error) {
            this.logger.error(`Error checking if bucket exists: ${error?.message || 'Unknown error'}`);
        }
    }
    async verifyBucketAccess() {
        try {
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .list();
            if (error) {
                throw new Error(`Bucket access error: ${error.message}`);
            }
            return true;
        }
        catch (error) {
            this.logger.error(`Bucket verification failed: ${error.message}`);
            throw error;
        }
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = SupabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map