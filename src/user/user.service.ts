/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ADDRESS_TYPE_ENUM, FILE_ENTITY_TYPE_ENUM } from 'prisma/enum';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { ChatType, Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/create-user.dto';

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
          business_users: true,
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

      const user_role = userData.user_roles.find((role) => role.is_active);

      const business_user = userData.business_users.find(
        (user) => user.is_active,
      );

      return {
        ...userData,
        address,
        avatar_url: avatarFile?.file_url || null,
        user_role: user_role,
        business_user: business_user,
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

  async updateUserStatus({
    user_id,
    last_seen,
  }: {
    user_id: string;
    last_seen: string;
  }) {
    try {
      const user = await this.prisma.user.update({
        where: { user_id },
        data: { last_seen },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserContacts({
    req,
    name,
  }: {
    req: UserAuthorizedRequest;
    name: string;
  }) {
    try {
      const userContacts: any = await this.prisma.user.findMany({
        where: {
          user_id: {
            not: req.user.user_id,
          },
          ...(name
            ? {
                OR: [
                  { first_name: { contains: name, mode: 'insensitive' } },
                  { last_name: { contains: name, mode: 'insensitive' } },
                  { email: { contains: name, mode: 'insensitive' } },
                ],
              }
            : undefined),
        },
        // i want to fins al users, but make sre if  teh usr is already in a direct chat with requesting user, i dont get that user

        include: {
          chat_participants: {
            where: {
              chat: {
                chat_type: ChatType.DIRECT,
              },
              user_id: {
                not: req.user.user_id,
              },
            },
          },
        },
        // select: {
        //   user_id: true,
        //   first_name: true,
        //   last_name: true,
        //   email: true,
        // },
      });

      for (const contact of userContacts) {
        const fileEntityType = await this.prisma.fileEntityType.findFirst({
          where: {
            entity_type: FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
          },
        });
        if (!fileEntityType) {
          continue;
        }
        const avatar = await this.prisma.files.findFirst({
          where: {
            entity_id: contact.user_id,
            entity_type_id: fileEntityType.entity_type_id,
          },
        });
        contact.avatar_url = avatar?.file_url || null;
      }

      return userContacts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser({
    req_user,
    data,
  }: {
    req_user: UserAuthorizedRequest;
    data: UpdateUserDto;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Update user basic info
        const user = await tx.user.update({
          where: { user_id: req_user.user.user_id },
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
          },
        });

        // Handle address update if provided
        if (data.address) {
          const address_entity = await tx.addressEntity.findFirst({
            where: {
              entity_type: ADDRESS_TYPE_ENUM.USER_HOME,
            },
          });
          if (!address_entity) {
            throw new BadRequestException('Address entity not found');
          }

          const address = await tx.address.findFirst({
            where: {
              entity_id: user.user_id,
              entity_type_id: address_entity.entity_type_id,
            },
          });

          if (!address) {
            await tx.address.create({
              data: {
                entity_id: user.user_id,
                entity_type_id: address_entity.entity_type_id,
                street: data.address.street,
                building: data.address.building,
                apartment: data.address.apartment,
                district: data.address.district,
                city: data.address.city,
                state: data.address.state,
                postal_code: data.address.postal_code,
                country: data.address.country,
                landmark: data.address.landmark,
                direction_url: data.address.direction_url,
                latitude: data.address.latitude,
                longitude: data.address.longitude,
              },
            });
          } else {
            await tx.address.update({
              where: { address_id: address.address_id },
              data: {
                street: data.address.street,
                building: data.address.building,
                apartment: data.address.apartment,
                district: data.address.district,
                city: data.address.city,
                state: data.address.state,
                postal_code: data.address.postal_code,
                country: data.address.country,
                landmark: data.address.landmark,
                direction_url: data.address.direction_url,
                latitude: data.address.latitude,
                longitude: data.address.longitude,
              },
            });
          }
        }

        // Handle avatar update if provided
        if (data.avatar_url) {
          const fileEntityType = await tx.fileEntityType.findFirst({
            where: {
              entity_type: FILE_ENTITY_TYPE_ENUM.USER_AVATAR,
            },
          });
          if (!fileEntityType) {
            throw new BadRequestException('File entity type not found');
          }

          const file = await tx.files.findFirst({
            where: {
              file_url: data.avatar_url,
              entity_id: user.user_id,
              entity_type_id: fileEntityType.entity_type_id,
            },
          });

          if (!file) {
            await tx.files.create({
              data: {
                file_url: data.avatar_url,
                entity_id: user.user_id,
                entity_type_id: fileEntityType.entity_type_id,
              },
            });
          } else {
            await tx.files.update({
              where: { file_id: file.file_id },
              data: {
                file_url: data.avatar_url,
              },
            });
          }
        }

        return user;
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
