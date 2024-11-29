import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig, typeORMConfig, typeORMEntities } from './config';
import { User } from './typeorm/entities';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule, MailModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  TypeOrmModule.forRoot({
    ...typeORMConfig,
    entities: typeORMEntities,
  }),
  TypeOrmModule.forFeature([User]),
  MailerModule.forRoot({ ...mailerConfig }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
  }),
  MailModule,
  AuthModule
]
})
export class AppModule { }
