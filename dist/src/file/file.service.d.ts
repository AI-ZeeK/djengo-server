import { ConfigService } from '@nestjs/config';
export type FileType = 'image' | 'video' | 'audio';
export declare class FileService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, fileType: 'image' | 'audio', userId: string): Promise<string>;
    uploadBase64File(base64Data: string, fileType: 'image' | 'audio', userId: string): Promise<string>;
    deleteFile(fileUrl: string): Promise<void>;
    uploadMultipleFiles(files: Express.Multer.File[], userId: string): Promise<Array<{
        url: string;
        type: FileType;
    }>>;
    uploadMultipleBase64Files(files: Array<{
        file: string;
        type: FileType;
    }>, userId: string): Promise<Array<{
        url: string;
        type: FileType;
    }>>;
    private determineFileType;
}
