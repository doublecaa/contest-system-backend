import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner, Candidate, Competition, Admin, User, Result, PermissionAction, PermissionModule, Role, RequestUpdate } from './database/entities';
import { BannerModule, CompetitionModule, ResultModule, AdminModule, UploadImageModule, UserModule, CandidateModule, PermissionModuleModule, PermissionActionModule, RoleModule, RequestUpdateModule, RealtimeModule } from './API';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      options: {
        trustServerCertificate: true
      },
      synchronize: true,
      entities: [
        Admin,
        User,
        Banner,
        Competition,
        Candidate,
        Result,
        PermissionAction,
        PermissionModule,
        Role,
        RequestUpdate
      ]
    }),
    AdminModule,
    UserModule,
    BannerModule,
    CompetitionModule,
    ResultModule,
    UploadImageModule,
    CandidateModule,
    ResultModule,
    PermissionModuleModule,
    PermissionActionModule,
    RoleModule,
    RequestUpdateModule,
    RealtimeModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
