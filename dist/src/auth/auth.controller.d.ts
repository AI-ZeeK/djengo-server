import { AuthService } from './auth.service';
import { InitiateLoginDto, InitiateRegisterDto, LoginDto, LogoutDto, RegisterDto, SendOtpDto, RefreshTokenDto } from './dto/create-auth.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(data: InitiateRegisterDto): Promise<{
        auth_token: string;
    }>;
    register(data: RegisterDto, res: Response): Promise<{
        user: {
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            email: string;
            user_id: string;
            first_name: string | null;
            last_name: string | null;
            password: string | null;
            date_of_birth: Date;
            phone_number: string | null;
            backup_phone_number: string | null;
            email_verified: boolean | null;
            phone_verified: boolean | null;
            kyc_verified: boolean | null;
            is_blocked: boolean | null;
            fcm_token: string;
            refresh_token: string;
            is_online: boolean | null;
        } | null;
        access_token: string;
    }>;
    login(data: LoginDto, res: Response): Promise<{
        user: {
            address: {
                is_active: boolean | null;
                created_at: Date | null;
                updated_at: Date | null;
                deleted_at: Date | null;
                entity_type_id: number;
                address_id: string;
                label: string | null;
                is_default: boolean | null;
                street: string | null;
                building: string | null;
                apartment: string | null;
                district: string | null;
                landmark: string | null;
                instruction_enter_building: string | null;
                city: string | null;
                state: string | null;
                postal_code: string | null;
                country: string | null;
                latitude: import("@internal/prisma-main/runtime/library").Decimal | null;
                longitude: import("@internal/prisma-main/runtime/library").Decimal | null;
                direction_url: string;
                entity_id: string;
            } | null;
            avatar_url: string | null;
            user_role: {
                role_name: string;
                is_active: boolean;
                user_id: string;
            } | null;
            user_roles: {
                role_name: string;
                is_active: boolean;
                user_id: string;
            }[];
            _count: {
                uploaded_files: number;
                receiver_transactions: number;
                sender_transactions: number;
                staff: number;
                reservations: number;
                verifications: number;
                platform_staff: number;
                user_roles: number;
                message: number;
                user_companies: number;
                read_receipts: number;
                chat_participants: number;
                unread_message_counts: number;
                push_subscriptions: number;
            };
            staff: {
                role_id: string | null;
                created_at: Date;
                updated_at: Date;
                user_id: string;
                company_id: string | null;
                staff_id: string;
                date_joined: Date;
                department_id: string | null;
                designation: string | null;
                profile_complete: boolean;
                payroll_active: boolean;
                staff_active: boolean;
            }[];
            message: {
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                file_url: string | null;
                file_type: string | null;
                file_size: number | null;
                message_id: string;
                chat_id: string;
                sender_id: string;
                content: string;
                media_urls: string[];
                type: import("@internal/prisma-main").$Enums.MessageType;
                status: import("@internal/prisma-main").$Enums.MessageStatus;
                duration: number | null;
            }[];
            uploaded_files: {
                description: string | null;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                entity_type_id: number;
                entity_id: string;
                file_id: string;
                file_url: string | null;
                file_type: string | null;
                file_size: number | null;
                uploaded_at: Date | null;
                uploaded_by_user_id: string | null;
            }[];
            receiver_transactions: {
                created_at: Date;
                company_id: string | null;
                status: import("@internal/prisma-main").$Enums.TransactionStatus;
                id: string;
                amount_usd: import("@internal/prisma-main/runtime/library").Decimal;
                specification: string;
                transaction_ref: string | null;
                currency_code: string;
                exchange_rate: import("@internal/prisma-main/runtime/library").Decimal;
                amount_converted: import("@internal/prisma-main/runtime/library").Decimal;
                receiver_user_id: string | null;
                sender_user_id: string | null;
                transaction_type_id: number | null;
                completed_at: Date | null;
            }[];
            sender_transactions: {
                created_at: Date;
                company_id: string | null;
                status: import("@internal/prisma-main").$Enums.TransactionStatus;
                id: string;
                amount_usd: import("@internal/prisma-main/runtime/library").Decimal;
                specification: string;
                transaction_ref: string | null;
                currency_code: string;
                exchange_rate: import("@internal/prisma-main/runtime/library").Decimal;
                amount_converted: import("@internal/prisma-main/runtime/library").Decimal;
                receiver_user_id: string | null;
                sender_user_id: string | null;
                transaction_type_id: number | null;
                completed_at: Date | null;
            }[];
            reservations: {
                created_at: Date;
                updated_at: Date;
                user_id: string;
                status: import("@internal/prisma-main").$Enums.ReservationStatus;
                reservation_id: string;
                branch_id: string;
                room_id: string | null;
                table_id: string | null;
                start_time: Date;
                end_time: Date;
            }[];
            verifications: {
                created_at: Date;
                updated_at: Date;
                user_id: string;
                verification_id: string;
                otp_code: string;
                purpose: import("@internal/prisma-main").$Enums.VerificationPurpose;
                expires_at: Date;
            }[];
            platform_staff: {
                role_id: number;
                is_active: boolean | null;
                created_at: Date;
                updated_at: Date;
                user_id: string;
                platform_staff_id: string;
            }[];
            user_companies: {
                created_at: Date;
                updated_at: Date;
                user_id: string;
                user_company_id: string;
                company_id: string;
                is_primary: boolean;
                is_owner: boolean;
            }[];
            read_receipts: {
                user_id: string;
                message_id: string;
                read_at: Date | null;
            }[];
            chat_participants: {
                is_active: boolean;
                user_id: string;
                chat_id: string;
                joined_at: Date;
                is_admin: boolean;
                left_at: Date | null;
                unread_count: number;
            }[];
            unread_message_counts: {
                user_id: string;
                chat_id: string;
                count: number;
                last_read_at: Date;
            }[];
            push_subscriptions: {
                created_at: Date;
                updated_at: Date;
                user_id: string;
                subscription_id: string;
                endpoint: string;
                p256dh: string | null;
                auth: string | null;
                platform: string;
            }[];
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            email: string;
            user_id: string;
            first_name: string | null;
            last_name: string | null;
            password: string | null;
            date_of_birth: Date;
            phone_number: string | null;
            backup_phone_number: string | null;
            email_verified: boolean | null;
            phone_verified: boolean | null;
            kyc_verified: boolean | null;
            is_blocked: boolean | null;
            fcm_token: string;
            refresh_token: string;
            is_online: boolean | null;
        } | null;
        access_token: string;
    }>;
    loginUser(data: InitiateLoginDto): Promise<{
        auth_token: string;
    }>;
    sendOtp(data: SendOtpDto): Promise<{
        message: string;
    }>;
    refreshAccessToken(data: RefreshTokenDto): Promise<{
        user: {
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            email: string;
            user_id: string;
            first_name: string | null;
            last_name: string | null;
            password: string | null;
            date_of_birth: Date;
            phone_number: string | null;
            backup_phone_number: string | null;
            email_verified: boolean | null;
            phone_verified: boolean | null;
            kyc_verified: boolean | null;
            is_blocked: boolean | null;
            fcm_token: string;
            refresh_token: string;
            is_online: boolean | null;
        };
        access_token: string;
    }>;
    logout(data: LogoutDto): Promise<{
        message: string;
    }>;
}
