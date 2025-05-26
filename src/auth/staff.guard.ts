/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: payload.user_id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid user ID');
      }

      const staff = await this.prisma.staff.findFirst({
        where: {
          user_id: payload.user_id,
          is_active: true,
        },
      });

      if (!staff) {
        throw new UnauthorizedException('Invalid staff ID');
      }

      request['user'] = {
        user_id: payload.user_id,
        staff_id: staff.staff_id,
      };
      const newToken = await this.jwtService.signAsync(
        { user_id: payload.user_id, staff_id: staff.staff_id },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRATION,
        },
      );

      response.cookie('access_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
