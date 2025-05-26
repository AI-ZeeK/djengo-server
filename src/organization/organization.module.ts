import { forwardRef, Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [forwardRef(() => AuthModule), CompanyModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
