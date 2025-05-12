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
            is_active: boolean;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
            email: string | null;
            phone_number: string | null;
            company_id: string;
            organization_id: string;
            registration_number: string | null;
            company_ref: string | null;
            company_name: string | null;
            registeration_date: Date | null;
        };
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): string;
    remove(id: string): string;
}
