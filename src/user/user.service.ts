/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@internal/prisma-main';
import {} from 'src/enums/enum';
import { ADDRESS_TYPE_ENUM, FILE_ENTITY_TYPE_ENUM } from 'prisma/enum';

type UserWithAvatar<T = {}> = User & {
  avatar_url: string | null;
} & T;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findOne<T extends Prisma.UserInclude>(
    where: Prisma.UserWhereUniqueInput,
    include?: T,
    sample_data?: boolean,
  ) {
    try {
      const fileEntityType = await this.prisma.fileEntityType.findFirst({
        where: {
          entity_type: FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
        },
      });
      if (!fileEntityType) {
        return null;
      }

      const userData = await this.prisma.user.findUnique({
        where,
        include: {
          user_roles: {
            where: {
              is_active: true,
            },
          },
          ...include,
        },
      });

      if (!userData) {
        return null;
      }
      const address_entity = await this.prisma.addressEntity.findFirst({
        where: {
          entity_type: ADDRESS_TYPE_ENUM.USER_HOME,
        },
      });
      if (!address_entity) {
        return null;
      }
      let address = await this.prisma.address.findFirst({
        where: {
          entity_id: userData.user_id,
        },
      });
      address = await this.prisma.address.findFirst({
        where: {
          entity_id: userData.user_id,
          entity_type_id: address_entity.entity_type_id,
        },
      });
      const avatarFile = await this.prisma.files.findFirst({
        where: {
          entity_id: userData.user_id,
          entity_type_id: fileEntityType.entity_type_id,
        },
      });

      return {
        ...userData,
        address,
        avatar_url: avatarFile?.file_url || null,
        user_role:
          Array.isArray(userData.user_roles) && userData.user_roles.length
            ? userData.user_roles[0]
            : null,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchByEmail({ email }: { email: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user)
        return {
          status: false,
          message: 'User with email does not exist',
          data: null,
        };
      return {
        status: true,
        message: 'User with email exists',
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
