import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Create new Image' })
  @ApiResponse({ status: 201 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.imageService.create(image, authHeader);
  }

  @ApiOperation({ summary: 'Get all Image file name' })
  @ApiResponse({ status: 200 })
  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    return this.imageService.findAll(authHeader);
  }

  @ApiOperation({ summary: 'Get Image by file name' })
  @ApiResponse({ status: 200 })
  @Get(':fileName')
  async findOne(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.imageService.findOne(fileName, res);
  }

  @ApiOperation({ summary: 'Delete Image by file name' })
  @ApiResponse({ status: 200 })
  @Delete(':fileName')
  async remove(
    @Param('fileName') fileName: string,
    @Headers('Authorization') authHeader: string,
  ) {
    return this.imageService.remove(fileName, authHeader);
  }
}
