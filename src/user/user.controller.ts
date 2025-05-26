/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserGuard } from 'src/auth/user.guard';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { UpdateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user account details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user account information',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        // Add other user properties as needed
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(UserGuard)
  @Get('account')
  async getMe(@Req() req: UserAuthorizedRequest) {
    const user = await this.userService.findOne({
      user_id: req.user.user_id,
    });
    return user;
  }

  @ApiOperation({ summary: 'Fetch user by email' })
  @ApiResponse({
    status: 200,
    description: 'Returns user information if found',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        // Add other user properties as needed
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('email/:email')
  async fetchByEmail(@Param('email') email: string) {
    return this.userService.fetchByEmail({ email });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user contacts' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter contacts by name',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of user contacts',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          // Add other contact properties as needed
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(UserGuard)
  @Get('contacts')
  async getUserContacts(
    @Req() req: UserAuthorizedRequest,
    @Query('name') name: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.userService.getUserContacts({ req, name });
  }

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully',
    schema: {
      type: 'object',
      properties: {
        user_id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' },
        // Add other updated user properties as needed
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Patch('update')
  async updateUser(
    @Req() req_user: UserAuthorizedRequest,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateUser({ req_user, data });
  }
}
