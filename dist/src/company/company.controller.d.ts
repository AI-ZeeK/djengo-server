import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(createCompanyDto: CreateCompanyDto): string;
    findAll(): string;
    findOne(company_ref: string): Promise<{
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
    update(id: string, updateCompanyDto: UpdateCompanyDto): string;
    remove(id: string): string;
}
