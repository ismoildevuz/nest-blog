import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { UserService } from '../user/user.service';
import { v4 } from 'uuid';

const storage = new Storage({
  projectId: 'upload-image-392818',
  keyFilename: 'keyfile.json',
});

const bucketName = 'upload-image-nest-blog';
const bucket = storage.bucket(bucketName);

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image)
    private readonly imageRepository: typeof Image,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(image: Express.Multer.File, authHeader: string) {
    if (!image) throw new BadRequestException('No image');
    const user = await this.userService.verifyToken(authHeader);

    try {
      const fileName =
        (await this.generateUniqueFileName()) + extname(image.originalname);
      const file = bucket.file(fileName);

      await file.save(image.buffer, { resumable: false });
      await this.imageRepository.create({
        id: v4(),
        file_name: fileName,
        user_id: user.id,
      });

      const url = `${process.env.BASE_URL}/api/image/${fileName}`;
      return {
        fileName,
        url,
      };
    } catch (error) {
      throw new HttpException(
        'Error with uploading images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(authHeader: string) {
    const user = await this.userService.verifyToken(authHeader);
    return this.imageRepository.findAll({
      where: { user_id: user.id },
      attributes: ['id', 'file_name', 'createdAt'],
    });
  }

  async findOne(fileName: string, res: Response) {
    const file = bucket.file(fileName);
    const exists = await file.exists();
    if (!exists[0]) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const stream = file.createReadStream();
    stream.pipe(res);
  }

  async remove(fileName: string, authHeader: string) {
    const image = await this.imageRepository.findOne({
      where: { file_name: fileName },
    });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    await this.userService.isUserSelf(image.user_id, authHeader);

    const file = bucket.file(fileName);
    const exists = await file.exists();
    if (exists[0]) {
      await file.delete();
      await this.imageRepository.destroy({ where: { file_name: fileName } });
      return fileName;
    } else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  async removeAllImageByUserId(user_id: string) {
    try {
      const images = await this.imageRepository.findAll({
        where: { user_id },
        attributes: ['id', 'file_name'],
      });
      for (let image of images) {
        const file = bucket.file(image.file_name);
        const exists = await file.exists();
        if (exists[0]) {
          await file.delete();
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateFileName() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    const suffix = Math.floor(Math.random() * 90000) + 10000;
    return prefix + suffix;
  }

  async generateUniqueFileName() {
    const [files] = await bucket.getFiles();
    const allUniqueFileNames = files.map((file) => file.name);

    let fileName: any;
    while (true) {
      fileName = await this.generateFileName();
      if (!allUniqueFileNames.includes(fileName)) break;
    }
    return fileName;
  }
}
