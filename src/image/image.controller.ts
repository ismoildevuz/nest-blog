import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.imageService.create(image);
  }

  @Get(':fileName')
  async getOne(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.imageService.getOne(fileName, res);
  }

  @Delete(':fileName')
  async remove(@Param('fileName') fileName: string) {
    return this.imageService.remove(fileName);
  }
}
