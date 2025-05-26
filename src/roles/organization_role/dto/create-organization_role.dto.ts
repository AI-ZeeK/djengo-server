import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationRoleDto {
  @ApiProperty({
    default: '',
    example: '',
  })
  @IsNotEmpty()
  @IsString()
  role_name: string;

  @ApiProperty({
    default: '',
    example: '',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    default: [
      {
        permission_name: 'permission_name',
        state: true,
      },
    ],
    example: [
      {
        permission_name: 'permission_name',
        state: true,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  permissions: { permission_name: string; state: boolean }[];

  @ApiProperty({
    default: [
      {
        business_user_id: 'business_user_id',
        state: true,
      },
    ],
    example: [
      {
        business_user_id: 'business_user_id',
        state: true,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  business_user_ids: string[];
}
