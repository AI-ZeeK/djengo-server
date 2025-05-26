import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
