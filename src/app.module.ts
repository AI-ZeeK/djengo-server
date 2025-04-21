import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { RoleModule } from './role/role.module';
import { CompanyModule } from './company/company.module';
import { ChatController } from './chat/chat.controller';
import { JwtService } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    MailModule,
    RoleModule,
    CompanyModule,
    FileModule,
    NotificationModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway, ChatService, JwtService],
})
export class AppModule {}
