/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  InitiateLoginDto,
  InitiateRegisterDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
  SendOtpDto,
  RefreshTokenDto,
} from './dto/create-auth.dto';
import { Response } from 'express';
import { cookieOptions } from 'src/lib/utils/cookie.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/initialize-register')
  async registerUser(@Body() data: InitiateRegisterDto) {
    return this.authService.initiateRegister({
      email: data.email,
      role_name: data.role_name,
    });
  }

  @Post('/register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, access_token } = await this.authService.register({
      email: data.email,
      role_name: data.role_name,
      password: data.password,
      organization_name: data.organization_name,
      company_ref: data.company_ref,
      phone_number: data.phone_number,
      organization_email: data.organization_email,
      organization_registration_date: data.organization_registration_date,
      organization_registration_number: data.organization_registration_number,
      organization_phone_number: data.organization_phone_number,
    });

    res.cookie('access_token', access_token, cookieOptions);

    // Return only the user
    return { user, access_token };
  }

  @Post('/login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, access_token } = await this.authService.login({
      email: data.email,
      password: data.password,
    });

    res.cookie('access_token', access_token, cookieOptions);

    return { user, access_token };
  }

  @Post('/initialize-login')
  async loginUser(@Body() data: InitiateLoginDto) {
    return this.authService.initiateLogin({ email: data.email });
  }
  @Post('/send-otp')
  async sendOtp(@Body() data: SendOtpDto) {
    return this.authService.sendOtp({ token: data.token });
  }

  @Post('/refresh')
  async refreshAccessToken(@Body() data: RefreshTokenDto) {
    return await this.authService.refreshToken(data.user_id);
  }

  @Post('/logout')
  async logout(@Body() data: LogoutDto) {
    return this.authService.logout({ user_id: data.user_id });
  }
}
