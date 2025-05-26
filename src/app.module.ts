import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { ChatModule } from './chat/chat.module';
import { UserRoleModule } from './roles/user_role/user_role.module';
import { OrganizationRoleModule } from './roles/organization_role/organization_role.module';
import { OrganizationModule } from './organization/organization.module';

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
    ChatModule,
    UserRoleModule,
    OrganizationRoleModule,
    OrganizationModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway, ChatService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
