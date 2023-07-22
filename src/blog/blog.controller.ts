import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Blog } from './models/blog.model';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Create new Blog' })
  @ApiResponse({ status: 201, type: Blog })
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @ApiOperation({ summary: 'Get all Blog' })
  @ApiResponse({ status: 200, type: [Blog] })
  @Get()
  async findAll() {
    return this.blogService.findAll();
  }

  @ApiOperation({ summary: 'Get Blog by ID' })
  @ApiResponse({ status: 200, type: Blog })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Blog by ID' })
  @ApiResponse({ status: 200, type: Blog })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @ApiOperation({ summary: 'Delete Blog by ID' })
  @ApiResponse({ status: 200, type: Blog })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
