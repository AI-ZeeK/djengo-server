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
import { OrganizationService } from './organization.service';
import { BusinessGuard } from 'src/auth/business.guard';
import { UpdateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationRequest } from 'src/interfaces/user.interface';
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(BusinessGuard)
  @Get('business')
  findOne(@Req() req: OrganizationRequest) {
    return this.organizationService.findOne({
      organization_id: req.user.organization_id,
    });
  }

  @UseGuards(BusinessGuard)
  @Get('business/users')
  findOrganizationUsers(@Req() req_user: OrganizationRequest) {
    return this.organizationService.findOrganizationUsers({
      req_user,
    });
  }

  @UseGuards(BusinessGuard)
  @Patch('business')
  update(@Req() req: OrganizationRequest, @Body() data: UpdateOrganizationDto) {
    return this.organizationService.update({
      organization_id: req.user.organization_id,
      data,
    });
  }
}
