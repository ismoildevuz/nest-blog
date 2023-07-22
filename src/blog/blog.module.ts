import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Blog]), forwardRef(() => UserModule)],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
