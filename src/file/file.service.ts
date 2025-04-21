/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Express } from 'express';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private configService: ConfigService) {
    // Initialize Cloudinary with environment variables
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload a file to Cloudinary
   * @param file The file to upload
   * @param fileType Type of file (image or audio)
   * @param userId User ID of the uploader
   * @returns URL of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    fileType: 'image' | 'audio',
    userId: string,
  ): Promise<string> {
    try {
      // Validate file type
      if (fileType === 'image' && !file.mimetype.startsWith('image/')) {
        throw new BadRequestException('Invalid image format');
      }

      if (fileType === 'audio' && !file.mimetype.startsWith('audio/')) {
        throw new BadRequestException('Invalid audio format');
      }

      // Set folder based on file type and user ID
      const folder = `djengo/${fileType}s/${userId}`;

      // Create a readable stream from the buffer
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null); // Mark the end of the stream

      // For audio files, we need to use 'video' as the resource_type in Cloudinary
      // This is because Cloudinary handles audio files under the 'video' resource type
      const resource_type = fileType === 'audio' ? 'video' : 'image';

      // Upload to Cloudinary using stream
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result?.secure_url) {
              reject(new Error('Failed to get secure URL from upload'));
              return;
            }
            resolve(result.secure_url);
            this.logger.log(
              `File uploaded successfully: ${result?.secure_url}`,
            );
          },
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload a base64 encoded file to Cloudinary (legacy support)
   * @param base64Data Base64 encoded file data
   * @param fileType Type of file (image or audio)
   * @param userId User ID of the uploader
   * @returns URL of the uploaded file
   */
  async uploadBase64File(
    base64Data: string,
    fileType: 'image' | 'audio',
    userId: string,
  ): Promise<string> {
    try {
      // Extract the actual base64 data from the string
      const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        throw new BadRequestException('Invalid base64 data');
      }

      const contentType = matches[1];

      // Validate content type based on fileType
      if (fileType === 'image' && !contentType.startsWith('image/')) {
        throw new BadRequestException('Invalid image format');
      }

      if (fileType === 'audio' && !contentType.startsWith('audio/')) {
        throw new BadRequestException('Invalid audio format');
      }

      // Set folder based on file type and user ID
      const folder = `djengo/${fileType}s/${userId}`;

      // Upload to Cloudinary
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          base64Data,
          {
            folder,
            resource_type: fileType === 'audio' ? 'video' : 'image',
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      });

      this.logger.log(`File uploaded successfully: ${uploadResult.secure_url}`);

      return uploadResult.secure_url;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param fileUrl URL of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract the public ID from the URL
      const urlParts = fileUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];

      // Get the folder path from the URL
      const folderPath = urlParts
        .slice(urlParts.indexOf('djengo'), urlParts.length - 1)
        .join('/');
      const fullPublicId = `${folderPath}/${publicId}`;

      // Delete from Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.destroy(
          fullPublicId,
          { resource_type: fileUrl.includes('/audio/') ? 'video' : 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
      });

      this.logger.log(`File deleted successfully: ${fullPublicId}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }
}
