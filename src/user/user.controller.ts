/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from 'src/auth/user.guard';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
  @Get('account')
  async getMe(@Req() req: UserAuthorizedRequest) {
    const user = await this.userService.findOne({
      user_id: req.user.user_id,
    });
    return user;
  }

  @Get('email/:email')
  async fetchByEmail(@Param('email') email: string) {
    return this.userService.fetchByEmail({ email });
  }
  @UseGuards(UserGuard)
  @Get('contacts')
  async getUserContacts(
    @Req() req: UserAuthorizedRequest,
    @Query('name') name: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.userService.getUserContacts({ req, name });
  }
}
