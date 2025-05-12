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
    organization_name: string;
    organization_email: string;
    organization_phone_number: string;
    organization_registration_number: string;
    organization_registration_date: string;
    company_ref: string;
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
