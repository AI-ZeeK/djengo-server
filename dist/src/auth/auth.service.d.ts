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
    validateRefreshToken({ user_id, refresh_token, }: {
        user_id: string;
        refresh_token: string;
    }): Promise<{
        user_id: string;
        access_token: Promise<{
            access_token: string;
        }>;
    } | null>;
    generateAccessToken({ user_id }: {
        user_id: string;
    }): Promise<{
        access_token: string;
    }>;
    generateAuthToken({ user_id }: {
        user_id: string;
    }): {
        auth_token: string;
    };
    initiateLogin({ email }: {
        email: string;
    }): Promise<{
        auth_token: string;
    }>;
    initiateRegister({ email, role_name, }: {
        email: string;
        role_name: string;
    }): Promise<{
        auth_token: string;
    }>;
    register({ email, role_name, password, organization_name, company_ref, phone_number, organization_email, organization_registration_date, organization_phone_number, organization_registration_number, }: {
        email: string;
        password: string;
        role_name: string;
        organization_name: string;
        company_ref: string;
        phone_number: string;
        organization_email: string;
        organization_phone_number: string;
        organization_registration_number: string;
        organization_registration_date: string;
    }): Promise<{
        user: {
            created_at: Date;
            updated_at: Date;
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
            last_seen: string;
            account_type: import(".prisma/client").$Enums.AccountType;
            permission_level: number;
        } | null;
        access_token: string;
    }>;
    private validateCompanyReference;
    login({ email, password }: {
        email: string;
        password: string;
    }): Promise<{
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
                latitude: import("@prisma/client/runtime/library").Decimal | null;
                longitude: import("@prisma/client/runtime/library").Decimal | null;
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
            entity_permissions: {
                role_id: number | null;
                entity_type: string;
                user_id: string | null;
                entity_id: string;
                permission_id: number;
                is_granted: boolean;
                granted_at: Date | null;
                granted_by_user_id: string | null;
                level: number;
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
                read_receipts: number;
                chat_participants: number;
                unread_message_counts: number;
                push_subscriptions: number;
                calendar_events: number;
                granted_permissions: number;
                organization_access: number;
                entity_permissions: number;
                organizations: number;
            };
            staff: {
                role_id: string | null;
                created_at: Date;
                updated_at: Date;
                user_id: string;
                staff_id: string;
                company_id: string;
                branch_id: string | null;
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
                type: import(".prisma/client").$Enums.MessageType;
                status: import(".prisma/client").$Enums.MessageStatus;
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
                status: import(".prisma/client").$Enums.TransactionStatus;
                id: string;
                amount_usd: import("@prisma/client/runtime/library").Decimal;
                specification: string;
                transaction_ref: string | null;
                currency_code: string;
                exchange_rate: import("@prisma/client/runtime/library").Decimal;
                amount_converted: import("@prisma/client/runtime/library").Decimal;
                receiver_user_id: string | null;
                sender_user_id: string | null;
                transaction_type_id: number | null;
                completed_at: Date | null;
            }[];
            sender_transactions: {
                created_at: Date;
                company_id: string | null;
                status: import(".prisma/client").$Enums.TransactionStatus;
                id: string;
                amount_usd: import("@prisma/client/runtime/library").Decimal;
                specification: string;
                transaction_ref: string | null;
                currency_code: string;
                exchange_rate: import("@prisma/client/runtime/library").Decimal;
                amount_converted: import("@prisma/client/runtime/library").Decimal;
                receiver_user_id: string | null;
                sender_user_id: string | null;
                transaction_type_id: number | null;
                completed_at: Date | null;
            }[];
            reservations: {
                created_at: Date;
                updated_at: Date;
                user_id: string;
                status: import(".prisma/client").$Enums.ReservationStatus;
                reservation_id: string;
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
                purpose: import(".prisma/client").$Enums.VerificationPurpose;
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
            calendar_events: {
                description: string | null;
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                company_id: string;
                start_time: Date;
                end_time: Date;
                event_id: string;
                title: string;
                event_type: import(".prisma/client").$Enums.EventType;
                is_all_day: boolean;
                color: string | null;
                is_recurring: boolean;
                recurrence_rule: string | null;
                created_by_staff_id: string;
                is_private: boolean;
            }[];
            granted_permissions: {
                role_id: number | null;
                entity_type: string;
                user_id: string | null;
                entity_id: string;
                permission_id: number;
                is_granted: boolean;
                granted_at: Date | null;
                granted_by_user_id: string | null;
                level: number;
            }[];
            organization_access: {
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                user_id: string;
                permission_level: import("@prisma/client/runtime/library").Decimal;
                access_id: string;
                organization_id: string;
            }[];
            organizations: {
                is_active: boolean;
                created_at: Date;
                updated_at: Date;
                deleted_at: Date | null;
                name: string;
                email: string;
                phone_number: string | null;
                email_verified: boolean;
                phone_verified: boolean;
                created_by: string;
                organization_id: string;
                registration_date: Date | null;
                registration_number: string | null;
            }[];
            created_at: Date;
            updated_at: Date;
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
            last_seen: string;
            account_type: import(".prisma/client").$Enums.AccountType;
            permission_level: number;
        } | null;
        access_token: string;
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
        user: {
            created_at: Date;
            updated_at: Date;
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
            last_seen: string;
            account_type: import(".prisma/client").$Enums.AccountType;
            permission_level: number;
        };
        access_token: string;
    }>;
}
