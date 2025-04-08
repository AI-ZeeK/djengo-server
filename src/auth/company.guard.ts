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
export class CompanyAuthGuard implements CanActivate {
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
      if (!payload.company_id) {
        throw new UnauthorizedException('Company ID is required');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: payload.user_id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid user ID');
      }

      const company = await this.prisma.company.findUnique({
        where: {
          company_id: payload.company_id,
        },
      });

      if (!company) {
        throw new UnauthorizedException('Invalid company ID');
      }

      request['user'] = {
        user_id: payload.user_id,
        company_id: payload.company_id,
      };

      const newToken = await this.jwtService.signAsync(
        { user_id: payload.user_id, company_id: payload.company_id },
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
