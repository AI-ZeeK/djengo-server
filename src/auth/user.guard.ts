/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    // Expecting format: "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      // console.log('GUARD', payload, 'PAYLOAD');
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: payload.user_id,
        },
      });
      // console.log('GUARD', user, 'USER');

      if (!user) {
        throw new UnauthorizedException('Invalid user ID');
      }

      // Attach user to request
      request['user'] = {
        user_id: payload.user_id,
        // Add other user properties you might need
      };

      // No need to set cookies anymore
      // The frontend is responsible for token management
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
