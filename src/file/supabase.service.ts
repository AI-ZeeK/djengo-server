import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { Express } from 'express';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_KEY',
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl!, supabaseServiceKey!);
  }

  /**
   * Upload a file to Supabase Storage
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
        throw new Error('Invalid image format');
      }

      if (fileType === 'audio' && !file.mimetype.startsWith('audio/')) {
        throw new Error('Invalid audio format');
      }

      // Create a unique file name
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('chat-media')
        .upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Get the public URL for the file
      const { data: urlData } = this.supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload a base64 encoded file to Supabase Storage
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
        throw new Error('Invalid base64 data');
      }

      const contentType = matches[1];
      const base64 = matches[2];

      // Validate content type based on fileType
      if (fileType === 'image' && !contentType.startsWith('image/')) {
        throw new Error('Invalid image format');
      }

      if (fileType === 'audio' && !contentType.startsWith('audio/')) {
        throw new Error('Invalid audio format');
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64, 'base64');

      // Create a unique file name
      const fileExt = contentType.split('/')[1];
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('chat-media')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        });

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Get the public URL for the file
      const { data: urlData } = this.supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param fileUrl URL of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const urlObj = new URL(fileUrl);
      const pathParts = urlObj.pathname.split('/');

      // The path should be in the format /storage/v1/object/public/bucket-name/path/to/file
      // We need to extract the path after the bucket name
      const bucketIndex = pathParts.findIndex((part) => part === 'chat-media');
      if (bucketIndex === -1) {
        throw new Error('Invalid file URL');
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      // Delete the file from Supabase Storage
      const { error } = await this.supabase.storage
        .from('chat-media')
        .remove([filePath]);

      if (error) {
        throw new Error(`Error deleting file: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }
}
