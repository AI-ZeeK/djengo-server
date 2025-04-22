import { ROLES_ENUM } from 'prisma/enum';
export declare class InitiateLoginDto {
    email: string;
}
export declare class InitiateRegisterDto {
    email: string;
    role_name: string;
}
export declare class RegisterDto {
    email: string;
    phone_number: string;
    role_name: ROLES_ENUM;
    password: string;
    confirm_password: string;
    company_name: string;
    company_email: string;
    company_phone_number: string;
    company_registration_number: string;
    company_registration_date: string;
    company_ref: string;
    multi_branch: boolean;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class SendOtpDto {
    token: string;
}
export declare class LogoutDto {
    user_id: string;
}
export declare class RefreshTokenDto {
    user_id: string;
}
