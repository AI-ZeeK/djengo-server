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

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
  @UseGuards(UserGuard)
  async getLastMessage(
    @Param('chat_id') chat_id: string,
    @Req() req: UserAuthorizedRequest,
  ) {
    return this.chatService.getLastMessage(chat_id);
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

  // @Post()
  // @UseGuards(UserGuard)
  // async createChat(
  //   @Body()
  //   createChatDto: {
  //     chat_type: ChatType;
  //     participant_ids: string[];
  //     name?: string;
  //   },
  //   @Req() req: UserAuthorizedRequest,
  // ) {
  //   try {
  //     const creator_id = req.user.user_id;

  //     // Create the chat using the service method
  //     const newChat = await this.chatService.createChat({
  //       creator_id,
  //       participant_ids: createChatDto.participant_ids,
  //       name: createChatDto.name,
  //     });

  //     return newChat;
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to create chat: ${error.message}`);
  //   }
  // }
}
