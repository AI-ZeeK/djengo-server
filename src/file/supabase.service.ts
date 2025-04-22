import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'djengo-audio-uploads';

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_KEY',
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      this.logger.error('Missing Supabase configuration');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure the bucket exists when the service is initialized
    this.ensureBucketExists().catch((err: Error | unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to ensure bucket exists: ${errorMessage}`);
    });
    this.logger.log('Supabase client initialized');
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
      await this.verifyBucketAccess();
      // Create a unique file name
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('djengo-audio-uploads')
        .upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error(
          `Error uploading file: ${error?.message || 'Unknown error'}`,
        );
      }

      // Get the public URL for the file
      const { data: urlData } = this.supabase.storage
        .from('djengo-audio-uploads')
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (error: any) {
      this.logger.error(
        `Error uploading file: ${error?.message || 'Unknown error'}`,
      );
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
        .from('djengo-audio-uploads')
        .upload(filePath, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        });

      if (error) {
        throw new Error(
          `Error uploading file: ${error?.message || 'Unknown error'}`,
        );
      }

      // Get the public URL for the file
      const { data: urlData } = this.supabase.storage
        .from('djengo-audio-uploads')
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (error) {
      this.logger.error(
        `Error uploading file: ${error?.message || 'Unknown error'}`,
      );
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
      const bucketIndex = pathParts.findIndex(
        (part) => part === 'djengo-audio-uploads',
      );
      if (bucketIndex === -1) {
        throw new Error('Invalid file URL');
      }

      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      // Delete the file from Supabase Storage
      const { error } = await this.supabase.storage
        .from('djengo-audio-uploads')
        .remove([filePath]);

      if (error) {
        throw new Error(
          `Error deleting file: ${error?.message || 'Unknown error'}`,
        );
      }

      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(
        `Error deleting file: ${error?.message || 'Unknown error'}`,
      );
      throw error;
    }
  }

  async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets?.some(
        (bucket) => bucket.name === 'djengo-audio-uploads',
      );

      if (!bucketExists) {
        this.logger.warn(
          'Bucket "djengo-audio-uploads" does not exist. Please create it manually in the Supabase dashboard.',
        );
      } else {
        this.logger.log('Bucket "djengo-audio-uploads" exists');
      }
    } catch (error) {
      this.logger.error(
        `Error checking if bucket exists: ${error?.message || 'Unknown error'}`,
      );
      // Don't throw the error, just log it
    }
  }

  private async verifyBucketAccess() {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list();

      if (error) {
        throw new Error(`Bucket access error: ${error.message}`);
      }

      return true;
    } catch (error) {
      this.logger.error(`Bucket verification failed: ${error.message}`);
      throw error;
    }
  }
}
