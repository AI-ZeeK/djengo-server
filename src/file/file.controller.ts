import {
  Controller,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UserGuard } from 'src/auth/user.guard';
import { UserAuthorizedRequest } from '../interfaces/user.interface';
import * as Multer from 'multer';
import { SupabaseService } from './supabase.service';

@Controller('files')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(
    private readonly fileService: FileService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @UseGuards(UserGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB max
          new FileTypeValidator({ fileType: /(image|audio)\/.+/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: UserAuthorizedRequest,
  ) {
    const userId = req.user.user_id;

    // Determine file type based on mimetype
    const fileType = file.mimetype.startsWith('image/') ? 'image' : 'audio';

    const fileUrl = await this.fileService.uploadFile(file, fileType, userId);

    return { url: fileUrl };
  }

  @UseGuards(UserGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB max for images
          new FileTypeValidator({ fileType: /image\/.+/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: UserAuthorizedRequest,
  ) {
    const userId = req.user.user_id;
    const fileUrl = await this.fileService.uploadFile(file, 'image', userId);

    return { url: fileUrl };
  }

  @UseGuards(UserGuard)
  @Post('upload/audio')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadAudioFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB max for audio
          new FileTypeValidator({ fileType: /audio\/.+/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: UserAuthorizedRequest,
  ) {
    const userId = req.user.user_id;
    const fileUrl = await this.fileService.uploadFile(file, 'audio', userId);
    // const fileUrl = await this.supabaseService.uploadFile(
    //   file,
    //   'audio',
    //   userId,
    // );

    return { url: fileUrl, duration: 0 }; // Return duration as 0, will be updated by client
  }

  @UseGuards(UserGuard)
  @Post('upload/base64')
  async uploadBase64File(
    @Body() body: { file: string; type: 'image' | 'audio' },
    @Req() req: UserAuthorizedRequest,
  ) {
    const { file, type } = body;
    const userId = req.user.user_id;

    // Validate the base64 data based on type
    if (type === 'image' && !file.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    if (type === 'audio' && !file.startsWith('data:audio/')) {
      throw new Error('Invalid audio format');
    }

    const fileUrl = await this.fileService.uploadBase64File(file, type, userId);

    return { url: fileUrl };
  }

  @UseGuards(UserGuard)
  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB max per file
          new FileTypeValidator({ fileType: /(image|video|audio)\/.+/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: UserAuthorizedRequest,
  ) {
    const userId = req.user.user_id;
    const results = await this.fileService.uploadMultipleFiles(files, userId);
    return { files: results };
  }

  @UseGuards(UserGuard)
  @Post('upload/multiple/base64')
  async uploadMultipleBase64Files(
    @Body()
    body: { files: Array<{ file: string; type: 'image' | 'video' | 'audio' }> },
    @Req() req: UserAuthorizedRequest,
  ) {
    const userId = req.user.user_id;
    const results = await this.fileService.uploadMultipleBase64Files(
      body.files,
      userId,
    );
    return { files: results };
  }
}
