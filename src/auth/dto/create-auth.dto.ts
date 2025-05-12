import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ROLES_ENUM } from 'prisma/enum';
import { Match } from 'src/decorators/match.decorator';

export class InitiateLoginDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class InitiateRegisterDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: 'number',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsString()
  role_name: string;
}
export class RegisterDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: 'string',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiProperty({
    type: 'string',
    example: 'CLIENT',
    enum: ROLES_ENUM,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ROLES_ENUM)
  role_name: ROLES_ENUM;

  @ApiProperty({
    type: 'string',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'password123', // Corrected example value
  })
  @IsNotEmpty()
  @Match('password') // Use the custom decorator here
  confirm_password: string;

  @ApiProperty({
    type: 'string',
    example: 'My Company',
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.BUSINESS_USER) // Only validate if role_name is COMPANY
  @IsNotEmpty()
  @IsString()
  organization_name: string;

  @ApiProperty({
    type: 'string',
    example: 'mycompany@email.com',
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.BUSINESS_USER) // Only validate if role_name is COMPANY
  @IsNotEmpty()
  @IsString()
  organization_email: string;

  @ApiProperty({
    type: 'string',
    example: '1234567890',
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.BUSINESS_USER) // Only validate if role_name is COMPANY
  @IsOptional()
  @IsString()
  organization_phone_number: string;

  @ApiProperty({
    type: 'string',
    example: '1234567890',
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.BUSINESS_USER) // Only validate if role_name is COMPANY
  @IsNotEmpty()
  @IsString()
  organization_registration_number: string;

  @ApiProperty({
    type: 'string',
    example: '2021-01-01',
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.BUSINESS_USER) // Only validate if role_name is COMPANY
  @IsNotEmpty()
  @IsString()
  organization_registration_date: string;

  @ApiProperty({
    type: 'string',
    example: 123,
    required: false,
  })
  @ValidateIf((o) => o.role_name === ROLES_ENUM.STAFF) // Only validate if role_name is STAFF
  @IsNotEmpty()
  @IsString()
  company_ref: string;
}
export class LoginDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    type: 'string',
    example: 'password123', // Corrected example value
  })
  @IsNotEmpty()
  password: string;
}
export class SendOtpDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class LogoutDto {
  @ApiProperty({
    type: 'string',
    example: 'email@email.com',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    type: 'string',
    example: 'refresh_token',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
