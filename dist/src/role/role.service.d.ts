import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class RoleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): string;
    findAll(): import("@internal/prisma-main").Prisma.PrismaPromise<{
        role_id: number;
        role_name: string | null;
        description: string | null;
        is_active: boolean | null;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
    }[]>;
    findMany(): import("@internal/prisma-main").Prisma.PrismaPromise<{
        role_id: number;
        role_name: string | null;
        description: string | null;
        is_active: boolean | null;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
    }[]>;
    findOne(id: number): string;
    update(id: number, updateRoleDto: UpdateRoleDto): string;
    remove(id: number): string;
}
