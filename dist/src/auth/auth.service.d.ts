import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private jwtService;
    private prisma;
    private mailService;
    private userService;
    private readonly logger;
    constructor(jwtService: JwtService, prisma: PrismaService, mailService: MailService, userService: UserService);
    validateRefreshToken({ user_id, company_id, staff_id, refresh_token, }: {
        user_id: string;
        refresh_token: string;
        company_id?: string;
        staff_id?: string;
    }): Promise<{
        user_id: any;
        access_token: Promise<{
            access_token: any;
        }>;
        company: any;
        staff: any;
    } | null>;
    generateAccessToken({ user_id, company_id, staff_id, }: {
        user_id: string;
        company_id?: string;
        staff_id?: string;
    }): Promise<{
        access_token: any;
    }>;
    generateAuthToken({ user_id }: {
        user_id: string;
    }): {
        auth_token: any;
    };
    initiateLogin({ email }: {
        email: string;
    }): Promise<{
        auth_token: any;
    }>;
    initiateRegister({ email, role_name, }: {
        email: string;
        role_name: string;
    }): Promise<{
        auth_token: any;
    }>;
    register({ email, role_name, password, company_name, company_ref, phone_number, company_email, company_phone_number, company_registration_date, company_registration_number, multi_branch, }: {
        email: string;
        password: string;
        role_name: string;
        company_name: string;
        company_ref: string;
        phone_number: string;
        company_email: string;
        company_phone_number: string;
        company_registration_date: string;
        company_registration_number: string;
        multi_branch: boolean;
    }): Promise<{
        user: any;
        access_token: any;
    }>;
    private validateCompanyReference;
    login({ email, password }: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        access_token: any;
    }>;
    logout({ user_id }: {
        user_id: string;
    }): Promise<{
        message: string;
    }>;
    sendOtp({ token }: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    refreshToken(user_id: string): Promise<{
        user: any;
        access_token: any;
    }>;
}
