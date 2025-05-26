/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { FILE_ENTITY_TYPE_ENUM } from 'prisma/enum';
import { UpdateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationRequest } from 'src/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async findOne({ organization_id }: { organization_id: string }) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: {
          organization_id,
        },
      });

      const fileEntityType = await this.prisma.fileEntityType.findFirst({
        where: {
          entity_type: FILE_ENTITY_TYPE_ENUM.ORGANIZATION_LOGO,
        },
      });
      let avatar_url: any = null;
      if (fileEntityType) {
        const organization_logo = await this.prisma.files.findFirst({
          where: {
            entity_type_id: fileEntityType.entity_type_id,
            entity_id: organization_id,
          },
        });
        avatar_url = organization_logo?.file_url || null;
      }

      return {
        ...organization,
        avatar_url,
      };
    } catch (error) {
      throw new NotFoundException('Organization not found');
    }
  }

  async findOrganizationUsers({ req_user }: { req_user: OrganizationRequest }) {
    try {
      const organization = await this.prisma.businessUser.findMany({
        where: {
          organization_id: req_user.user.organization_id,
        },
        include: {
          user: true,
        },
      });

      for (const businessUser of organization as any) {
        const user = await this.userService.findOne({
          user_id: businessUser.user_id,
        });

        businessUser.user = user;
      }
      return organization;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update({
    organization_id,
    data,
  }: {
    organization_id: string;
    data: UpdateOrganizationDto;
  }) {
    try {
      const organization = await this.prisma.organization.update({
        where: { organization_id },
        data: {
          name: data.name,
          email: data.email,
          phone_number: data.phone_number,
          registration_number: data.registration_number,
          registration_date: new Date(data.registration_date),
        },
      });

      let avatar_url: any = null;
      if (data.avatar_url) {
        const fileEntityType = await this.prisma.fileEntityType.findFirst({
          where: {
            entity_type: FILE_ENTITY_TYPE_ENUM.ORGANIZATION_LOGO,
          },
        });

        if (fileEntityType) {
          let organization_logo = await this.prisma.files.findFirst({
            where: {
              entity_type_id: fileEntityType.entity_type_id,
              entity_id: organization_id,
            },
          });

          if (!organization_logo) {
            organization_logo = await this.prisma.files.create({
              data: {
                entity_type_id: fileEntityType.entity_type_id,
                entity_id: organization_id,
                file_url: data.avatar_url,
              },
            });
          } else {
            organization_logo = await this.prisma.files.update({
              where: { file_id: organization_logo.file_id },
              data: { file_url: data.avatar_url },
            });
          }
          avatar_url = organization_logo?.file_url || '';
        }
      }

      return {
        ...organization,
        avatar_url,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
