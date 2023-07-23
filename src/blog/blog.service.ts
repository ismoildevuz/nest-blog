import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { UserService } from './../user/user.service';
import { v4 } from 'uuid';
import { User } from '../user/models/user.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog)
    private readonly blogRepository: typeof Blog,
    private readonly userService: UserService,
  ) {}

  async create(createBlogDto: CreateBlogDto, authHeader: string) {
    await this.userService.isUserSelf(createBlogDto.user_id, authHeader);
    try {
      const newBlog = await this.blogRepository.create({
        id: v4(),
        ...createBlogDto,
        views: 0,
      });
      return this.getOne(newBlog.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.blogRepository.findAll({
        attributes: ['id', 'title', 'body', 'views', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'username'],
          },
        ],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const blog = await this.getOne(id);
      await this.blogRepository.update(
        { views: blog.views + 1 },
        { where: { id } },
      );
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, authHeader: string) {
    const blog = await this.getOne(id);
    await this.userService.isUserSelf(blog.user.id, authHeader);

    try {
      await this.blogRepository.update(updateBlogDto, { where: { id } });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string, authHeader: string) {
    const blog = await this.getOne(id);
    await this.userService.isUserSelf(blog.user.id, authHeader);

    try {
      await this.blogRepository.destroy({ where: { id } });
      return blog;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        attributes: ['id', 'title', 'body', 'views', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'full_name', 'username'],
          },
        ],
      });
      if (!blog) {
        throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
      }
      return blog;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
