import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@internal/prisma-main';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
