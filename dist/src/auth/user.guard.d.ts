import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserGuard implements CanActivate {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
