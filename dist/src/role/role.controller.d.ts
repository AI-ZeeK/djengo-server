import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
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
    findOne(id: string): string;
    update(id: string, updateRoleDto: UpdateRoleDto): string;
    remove(id: string): string;
}
