/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ROLES_ENUM } from 'prisma/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class BusinessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const user = await this.userService.findOne({
        user_id: payload.user_id,
      });

      if (!user) {
        throw new UnauthorizedException('Invalid user ID');
      }

      if (
        !user.user_role ||
        user.user_role.role_name !== ROLES_ENUM.BUSINESS_USER
      ) {
        throw new UnauthorizedException('You can not access this resource');
      }

      const businessUser = await this.prisma.businessUser.findFirst({
        where: {
          user_id: payload.user_id,
          is_active: true,
        },
      });

      if (!businessUser) {
        throw new BadRequestException('Invalid business user ID');
      }

      request['user'] = {
        user_id: payload.user_id,
        organization_id: businessUser.organization_id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
