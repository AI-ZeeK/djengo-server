/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrganizationRoleDto } from './dto/update-organization_role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationRequest } from 'src/interfaces/user.interface';

@Injectable()
export class OrganizationRoleService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    role_name: string;
    organization_id: string;
    description: string;
    business_user_ids: string[];
    permissions: { permission_name: string; state: boolean }[];
    req_user: OrganizationRequest;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Create the organization role
        const organizationRole = await tx.organizationRole.create({
          data: {
            name: data.role_name,
            organization_id: data.organization_id,
            slug: data.role_name.toLowerCase().replace(/ /g, '-'),
            description: data.description,
            is_org_level: true,
          },
        });

        // Handle business user assignments
        if (data.business_user_ids && data.business_user_ids.length > 0) {
          // Deactivate existing roles
          await tx.businessUserRole.updateMany({
            where: {
              business_user_id: {
                in: data.business_user_ids,
              },
              is_active: true,
            },
            data: {
              is_active: false,
            },
          });

          // Create new role assignments
          await tx.businessUserRole.createMany({
            data: data.business_user_ids.map((business_user_id) => ({
              role_id: organizationRole.role_id,
              business_user_id: business_user_id,
              is_active: true,
            })),
          });
        }

        // Handle permissions
        const permissions = await tx.permission.findMany({
          where: {
            permission_name: {
              in: data.permissions.map((p) => p.permission_name),
            },
          },
        });

        // Create entity permissions
        const entityPermissions = data.permissions
          .map((permission) => {
            const foundPermission = permissions.find(
              (p) => p.permission_name === permission.permission_name,
            );
            if (!foundPermission) return null;

            return {
              organization_role_id: organizationRole.role_id,
              entity_type: 'role',
              permission_id: foundPermission.permission_id,
              user_id: data.req_user.user.user_id,
              is_granted: permission.state,
              granted_by_user_id: data.req_user.user.user_id,
              granted_at: new Date(),
            };
          })
          .filter(
            (permission): permission is NonNullable<typeof permission> =>
              permission !== null,
          );

        if (entityPermissions.length > 0) {
          await tx.entityPermission.createMany({
            data: entityPermissions,
          });
        }

        return organizationRole;
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    return this.prisma.organizationRole.findMany({
      include: {
        organization: true,
      },
    });
  }
  async findAllByOrganization({ req_user }: { req_user: OrganizationRequest }) {
    try {
      const roles = await this.prisma.organizationRole.findMany({
        where: { organization_id: req_user.user.organization_id },
        include: {
          organization: true,
          _count: {
            select: {
              business_user_roles: {
                where: {
                  is_active: true,
                },
              },
            },
          },
        },
      });

      return roles;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findOne({
    role_id,
    req_user,
  }: {
    role_id: string;
    req_user: OrganizationRequest;
  }) {
    try {
      const organization_role = await this.prisma.organizationRole.findUnique({
        where: {
          unique_organization_role: {
            organization_id: req_user.user.organization_id,
            slug: role_id,
            is_org_level: true,
          },
        },
        include: {
          business_user_roles: {
            where: {
              is_active: true,
            },
            include: {
              business_user: true,
            },
          },
        },
      });

      if (!organization_role) {
        throw new NotFoundException('Organization role not found');
      }

      const entity_permissions = await this.prisma.entityPermission.findMany({
        where: {
          OR: [
            {
              organization_role_id: organization_role.role_id,
            },
            {
              entity_id: organization_role.role_id,
            },
          ],
        },
        include: {
          permission: true,
        },
      });

      return { ...organization_role, entity_permissions };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update({
    req_user,
    role_id,
    role_name,
    description,
    permissions,
    business_user_ids,
  }: {
    role_id: string;
    role_name: string;
    description: string;
    permissions: { permission_name: string; state: boolean }[];
    business_user_ids: string[];
    req_user: OrganizationRequest;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const organizationRole = await tx.organizationRole.update({
          where: {
            unique_organization_role: {
              organization_id: req_user.user.organization_id,
              slug: role_id,
              is_org_level: true,
            },
          },
          data: {
            name: role_name,
            description,
            is_org_level: true,
          },
        });

        if (business_user_ids && business_user_ids.length > 0) {
          // First verify all business users exist
          const existingUsers = await tx.businessUser.findMany({
            where: {
              business_user_id: {
                in: business_user_ids,
              },
              organization_id: req_user.user.organization_id,
            },
            select: {
              business_user_id: true,
            },
          });

          const validUserIds = existingUsers.map(
            (user) => user.business_user_id,
          );

          // Deactivate existing roles for valid users
          await tx.businessUserRole.updateMany({
            where: {
              business_user_id: {
                in: validUserIds,
              },
              is_active: true,
            },
            data: {
              is_active: false,
            },
          });

          // Create or update role assignments for valid users
          for (const business_user_id of validUserIds) {
            const businessUserRole = await tx.businessUserRole.findFirst({
              where: {
                business_user_id: business_user_id,
                role_id: organizationRole.role_id,
              },
            });

            if (!businessUserRole) {
              await tx.businessUserRole.create({
                data: {
                  role_id: organizationRole.role_id,
                  business_user_id: business_user_id,
                  is_active: true,
                },
              });
            } else {
              await tx.businessUserRole.update({
                where: {
                  role_id: organizationRole.role_id,
                  business_user_id: business_user_id,
                },
                data: {
                  is_active: true,
                },
              });
            }
          }
        }

        for (const permission of permissions) {
          const _permission = await tx.permission.findFirst({
            where: {
              permission_name: permission.permission_name,
            },
          });

          if (_permission) {
            try {
              const existingPermission = await tx.entityPermission.findFirst({
                where: {
                  entity_type: 'role',
                  permission_id: _permission.permission_id,
                },
              });

              if (existingPermission) {
                await tx.entityPermission.update({
                  where: {
                    entity_id: existingPermission.entity_id,
                  },
                  data: {
                    is_granted: permission.state,
                    granted_at: new Date(),
                  },
                });
              }
            } catch (error) {
              // If update fails, create new entity permission
              await tx.entityPermission.create({
                data: {
                  entity_type: 'role',
                  permission_id: _permission.permission_id,
                  organization_role_id: organizationRole.role_id,
                  is_granted: permission.state,
                  granted_at: new Date(),
                  user_id: req_user.user.user_id,
                  granted_by_user_id: req_user.user.user_id,
                },
              });
            }
          }
        }
        return organizationRole;
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(role_id: string) {
    return this.prisma.organizationRole.update({
      where: { role_id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
