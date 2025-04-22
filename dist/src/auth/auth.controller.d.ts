import { AuthService } from './auth.service';
import { InitiateLoginDto, InitiateRegisterDto, LoginDto, LogoutDto, RegisterDto, SendOtpDto, RefreshTokenDto } from './dto/create-auth.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(data: InitiateRegisterDto): Promise<{
        auth_token: any;
    }>;
    register(data: RegisterDto, res: Response): Promise<{
        user: any;
        access_token: any;
    }>;
    login(data: LoginDto, res: Response): Promise<{
        user: any;
        access_token: any;
    }>;
    loginUser(data: InitiateLoginDto): Promise<{
        auth_token: any;
    }>;
    sendOtp(data: SendOtpDto): Promise<{
        message: string;
    }>;
    refreshAccessToken(data: RefreshTokenDto): Promise<{
        user: any;
        access_token: any;
    }>;
    logout(data: LogoutDto): Promise<{
        message: string;
    }>;
}
