import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsOptional()
  building: string;

  @IsString()
  @IsOptional()
  apartment: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsOptional()
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  @IsOptional()
  direction_url: string;

  @IsNumber()
  @IsOptional()
  latitude: number;

  @IsNumber()
  @IsOptional()
  longitude: number;
}
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsObject()
  @IsOptional()
  address: AddressDto;
}
