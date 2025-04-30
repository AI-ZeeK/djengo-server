import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserGuard } from 'src/auth/user.guard';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { ChatType } from '@internal/prisma-main';
import { CreateChatDto } from './dto/create-chat.dto';
@UseGuards(UserGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: UserAuthorizedRequest,
  ) {
    try {
      console.log('createChatDto', createChatDto);
      const creator_id = req.user.user_id;
      console.log('CREATOR_ID', creator_id);
      console.log('participant_id', createChatDto.participant_id);

      if (createChatDto.chat_type === ChatType.DIRECT) {
        return this.chatService.createDirectChat({
          creator_id,
          participant_id: createChatDto.participant_id,
        });
      } else if (createChatDto.chat_type === ChatType.GROUP) {
        return this.chatService.createGroupChat({
          creator_id,
          participant_ids: createChatDto.participant_ids,
          name: createChatDto.name,
        });
      }

      return {
        message: 'Chat created successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create chat: ${error.message}`);
    }
  }

  @Get('chats')
  @UseGuards(UserGuard)
  getChats(@Req() req: UserAuthorizedRequest) {
    return this.chatService.getChats({ user_id: req.user.user_id });
  }

  @Get('messages/:chat_id')
  @UseGuards(UserGuard)
  getMessages(
    @Param('chat_id') chat_id: string,
    @Req() req: UserAuthorizedRequest,
  ) {
    return this.chatService.getMessages({ chat_id, req_user: req });
  }

  @Get('last-message/:chat_id')
  async getLastMessage(
    @Param('chat_id') chat_id: string,
    @Req() req: UserAuthorizedRequest,
  ) {
    return this.chatService.getLastMessage({ chat_id });
  }

  @Get('last-messages')
  @UseGuards(UserGuard)
  async getLastMessages(
    @Query('chat_ids') chat_ids: string,
    @Req() req: UserAuthorizedRequest,
  ) {
    const chatIdsArray = chat_ids.split(',');
    return this.chatService.getLastMessagesForChats(chatIdsArray);
  }
}
