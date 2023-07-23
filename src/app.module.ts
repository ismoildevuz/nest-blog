import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/models/blog.model';
import { ImageModule } from './image/image.module';
import { FollowModule } from './follow/follow.module';
import { Follow } from './follow/models/follow.model';
import { Image } from './image/models/image.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASSWORD),
      database: process.env.PG_DB,
      autoLoadModels: true,
      logging: false,
      // ssl: true,
      // dialectOptions: {
      //   ssl: {
      //     require: true,
      //     rejectUnauthorized: false,
      //   },
      // },
      models: [User, Blog, Follow, Image],
    }),
    UserModule,
    BlogModule,
    ImageModule,
    FollowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
