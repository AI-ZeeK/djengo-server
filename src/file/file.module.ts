import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ConfigModule, forwardRef(() => AuthModule)],
  controllers: [FileController],
  providers: [FileService, SupabaseService],
  exports: [FileService],
})
export class FileModule {}
