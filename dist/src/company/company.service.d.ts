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
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            email: string | null;
            phone_number: string | null;
            organization_id: string;
            company_id: string;
            registration_number: string | null;
            company_ref: string | null;
            company_name: string | null;
            registeration_date: Date | null;
        };
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCompanyDto: UpdateCompanyDto): string;
    remove(id: number): string;
}
