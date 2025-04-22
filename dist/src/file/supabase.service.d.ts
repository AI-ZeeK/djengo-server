import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
export declare class SupabaseService {
    private configService;
    private readonly logger;
    private supabase;
    private readonly bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, fileType: 'image' | 'audio', userId: string): Promise<string>;
    uploadBase64File(base64Data: string, fileType: 'image' | 'audio', userId: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    ensureBucketExists(): Promise<void>;
    private verifyBucketAccess;
}
