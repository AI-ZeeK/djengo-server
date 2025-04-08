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
} from './dto/create-auth.dto';
import { Response } from 'express';

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
      company_name: data.company_name,
      company_ref: data.company_ref,
      phone_number: data.phone_number,
      company_email: data.company_email,
      company_registration_date: data.company_registration_date,
      company_registration_number: data.company_registration_number,
      multi_branch: data.multi_branch,
      company_phone_number: data.company_phone_number,
    });

    res.cookie('access_token', access_token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      // sameSite: 'strict', // Prevent CSRF attacks
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // domain: 'localhost', // Set this to your domain (e.g., 'localhost' for development)
      path: '/',
    });

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

    res.cookie('access_token', access_token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      // sameSite: 'strict', // Prevent CSRF attacks
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // domain: 'localhost', // Set this to your domain (e.g., 'localhost' for development)
      path: '/',
    });

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
  async refreshAccessToken(@Req() req, @Res() res) {
    const { user_id, refresh_token, company_id, staff_id } = req.cookies;

    const result = await this.authService.validateRefreshToken({
      user_id,
      refresh_token,
      company_id,
      staff_id,
    });

    if (!result)
      return res.status(401).json({ message: 'Invalid refresh token' });

    if (company_id && !result.company)
      return res.status(403).json({ message: 'Unauthorized: Invalid company' });

    if (staff_id && !result.staff)
      return res.status(403).json({ message: 'Unauthorized: Invalid staff' });

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json({ access_token: result.access_token });
  }

  @Post('/logout')
  async logout(@Body() data: LogoutDto) {
    return this.authService.logout({ user_id: data.user_id });
  }
}
