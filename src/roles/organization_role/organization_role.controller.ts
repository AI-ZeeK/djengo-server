import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrganizationRoleService } from './organization_role.service';
import { CreateOrganizationRoleDto } from './dto/create-organization_role.dto';
import { BusinessGuard } from 'src/auth/business.guard';
import { OrganizationRequest } from 'src/interfaces/user.interface';

@Controller('organization-role')
export class OrganizationRoleController {
  constructor(
    private readonly organizationRoleService: OrganizationRoleService,
  ) {}

  @UseGuards(BusinessGuard)
  @Post('business')
  create(
    @Body() data: CreateOrganizationRoleDto,
    @Req() req: OrganizationRequest,
  ) {
    return this.organizationRoleService.create({
      organization_id: req.user.organization_id,
      role_name: data.role_name,
      description: data.description || '',
      permissions: data.permissions,
      business_user_ids: data.business_user_ids,
      req_user: req,
    });
  }

  @UseGuards(BusinessGuard)
  @Get('platform')
  findAllPlatformRoles() {
    return this.organizationRoleService.findAll();
  }

  @UseGuards(BusinessGuard)
  @Get('/business')
  findAllBusinessRoles(@Req() req: OrganizationRequest) {
    return this.organizationRoleService.findAllByOrganization({
      req_user: req,
    });
  }

  @UseGuards(BusinessGuard)
  @Get('business/:role_id')
  findOne(@Param('role_id') role_id: string, @Req() req: OrganizationRequest) {
    return this.organizationRoleService.findOne({
      role_id,
      req_user: req,
    });
  }

  @UseGuards(BusinessGuard)
  @Patch('/business/:role_id')
  update(
    @Param('role_id') role_id: string,
    @Body() data: CreateOrganizationRoleDto,
    @Req() req: OrganizationRequest,
  ) {
    return this.organizationRoleService.update({
      role_id,
      role_name: data.role_name,
      description: data.description || '',
      permissions: data.permissions,
      business_user_ids: data.business_user_ids,
      req_user: req,
    });
  }

  @Delete('/business/:role_id')
  remove(@Param('role_id') role_id: string) {
    return this.organizationRoleService.remove(role_id);
  }
}
