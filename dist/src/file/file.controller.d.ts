import { FileService } from './file.service';
import { UserAuthorizedRequest } from '../interfaces/user.interface';
import { SupabaseService } from './supabase.service';
export declare class FileController {
    private readonly fileService;
    private readonly supabaseService;
    private readonly logger;
    constructor(fileService: FileService, supabaseService: SupabaseService);
    uploadFile(file: Express.Multer.File, req: UserAuthorizedRequest): Promise<{
        url: string;
    }>;
    uploadImageFile(file: Express.Multer.File, req: UserAuthorizedRequest): Promise<{
        url: string;
    }>;
    uploadAudioFile(file: Express.Multer.File, req: UserAuthorizedRequest): Promise<{
        url: string;
        duration: number;
    }>;
    uploadBase64File(body: {
        file: string;
        type: 'image' | 'audio';
    }, req: UserAuthorizedRequest): Promise<{
        url: string;
    }>;
    uploadMultipleFiles(files: Express.Multer.File[], req: UserAuthorizedRequest): Promise<{
        files: {
            url: string;
            type: import("./file.service").FileType;
        }[];
    }>;
    uploadMultipleBase64Files(body: {
        files: Array<{
            file: string;
            type: 'image' | 'video' | 'audio';
        }>;
    }, req: UserAuthorizedRequest): Promise<{
        files: {
            url: string;
            type: import("./file.service").FileType;
        }[];
    }>;
}
