import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ChatType } from '@internal/prisma-main';

export class CreateChatDto {
  @ApiProperty({
    enum: ChatType,
    example: ChatType.GROUP,
  })
  @IsEnum(ChatType)
  @IsNotEmpty()
  chat_type: ChatType;

  @ApiProperty({
    type: 'string',
    example: 'My Group Chat',
    required: false,
  })
  @ValidateIf((o: { chat_type: ChatType }) => o.chat_type === ChatType.GROUP)
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    type: 'string',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  chat_avatar: string;

  @ApiProperty({
    type: 'string',
    example: 'user123',
    required: false,
    description:
      'ID of the user creating the chat. Usually comes from authenticated user.',
  })
  @IsOptional()
  @IsString()
  creator_id: string;

  @ApiProperty({
    type: 'string',
    example: 'user456',
    required: false,
    description: 'Single participant ID for private chats',
  })
  @ValidateIf((o: { chat_type: ChatType }) => o.chat_type === ChatType.DIRECT)
  @IsNotEmpty()
  @IsString()
  participant_id: string;

  @ApiProperty({
    type: [String],
    example: ['user1_id', 'user2_id'],
    description: 'Array of participant IDs for group chats',
  })
  @ValidateIf((o: { chat_type: ChatType }) => o.chat_type === ChatType.GROUP)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participant_ids: string[];
}
