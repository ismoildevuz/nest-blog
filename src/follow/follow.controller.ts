import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Follow } from './models/follow.model';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: 'Create new Follow' })
  @ApiResponse({ status: 201, type: Follow })
  @Post()
  async create(
    @Body() createFollowDto: CreateFollowDto,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.followService.create(createFollowDto, authHeader);
  }

  @ApiOperation({ summary: 'Get all Follow' })
  @ApiResponse({ status: 200, type: [Follow] })
  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.followService.findAll(authHeader);
  }

  @ApiOperation({ summary: 'Get Follow by ID' })
  @ApiResponse({ status: 200, type: Follow })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.followService.findOne(id, authHeader);
  }
}
