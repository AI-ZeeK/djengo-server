import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@internal/prisma-main';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne<T extends Prisma.UserInclude>(where: Prisma.UserWhereUniqueInput, include?: T, sample_data?: boolean): Promise<any>;
    fetchByEmail({ email }: {
        email: string;
    }): Promise<{
        status: boolean;
        message: string;
        data: any;
    }>;
    updateUserStatus(user_id: string, is_online: boolean): Promise<any>;
    getUserContacts({ req, name, }: {
        req: UserAuthorizedRequest;
        name: string;
    }): Promise<any>;
}
