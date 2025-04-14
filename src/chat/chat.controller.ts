import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
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
}
