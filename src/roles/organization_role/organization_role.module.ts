import { forwardRef, Module } from '@nestjs/common';
import { OrganizationRoleService } from './organization_role.service';
import { OrganizationRoleController } from './organization_role.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [OrganizationRoleController],
  providers: [OrganizationRoleService],
})
export class OrganizationRoleModule {}
