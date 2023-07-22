import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = ['.jpeg', '.jpg', '.png'];
  private readonly maxSize = 1 * 1024 * 1024; // 1 MB

  transform(value: any) {
    try {
      if (value) {
        const file = value?.originalname;
        const fileExtension = extname(file).toLowerCase();

        if (!this.allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Only JPEG, JPG and PNG image files are allowed.',
          );
        }

        if (value.size > this.maxSize) {
          throw new BadRequestException(
            'Image file size should be under 1 MB.',
          );
        }

        return value;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
