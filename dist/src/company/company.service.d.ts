import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): string;
    fetchByCompanyRef({ company_ref }: {
        company_ref: string;
    }): Promise<{
        status: boolean;
        message: string;
        data: null;
    } | {
        status: boolean;
        message: string;
        data: {
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            email: string | null;
            phone_number: string | null;
            backup_phone_number: string | null;
            email_verified: boolean | null;
            phone_verified: boolean | null;
            company_id: string;
            company_ref: string | null;
            company_name: string | null;
            registeration_date: Date | null;
            registration_number: string | null;
            multi_branch: boolean | null;
        };
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCompanyDto: UpdateCompanyDto): string;
    remove(id: number): string;
}
