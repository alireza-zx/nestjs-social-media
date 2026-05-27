import path from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import envValidation from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { databaseFactory } from './config/database.factory';
import { jwtConfig } from './config/jwt.config';
import { appConfig } from './config/app.config';
import cookieParser from 'cookie-parser';
import { cookiesConfig } from './config/cookies.config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { SessionsModule } from './sessions/sessions.module';
import { SessionsController } from './sessions/sessions.controller';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { CommentLikesModule } from './comment-likes/comment-likes.module';
import { uploadConfig } from './config/upload.config';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TagsModule } from './tags/tags.module';
import { PaginationModule } from './pagination/pagination.module';
import { FollowsModule } from './follows/follows.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ResponseSerializer } from './common/interceptors/response-serializer.interceptor';
import { MailModule } from './mail/mail.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RolesGuard } from './auth/guards/roles.guard';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? '.env.development'
        : '.env.production',
      load: [appConfig, databaseConfig, cookiesConfig, jwtConfig, uploadConfig],
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseFactory
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/'
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 30
    }]),
    UsersModule,
    AuthModule,
    SessionsModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    CommentLikesModule,
    UploadsModule,
    TagsModule,
    PaginationModule,
    FollowsModule,
    ConversationsModule,
    MessagesModule,
    MailModule,
    VerificationCodeModule,
    NotificationsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseSerializer
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  controllers: [SessionsController]
})
export class AppModule implements NestModule {
  constructor(
    // Inject ConfigService
    private readonly configService: ConfigService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes('*');
  }
}