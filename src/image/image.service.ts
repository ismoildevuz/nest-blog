import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { extname } from 'path';

const storage = new Storage({
  projectId: 'upload-image-392818',
  keyFilename: 'keyfile.json',
});

@Injectable()
export class ImageService {
  async create(image: Express.Multer.File) {
    try {
      const bucketName = 'upload-image-nest-blog';
      const bucket = storage.bucket(bucketName);

      const fileName =
        (await this.generateUniqueFileName()) + extname(image.originalname);
      const file = bucket.file(fileName);

      await file.save(image.buffer, { resumable: false });
      const url = `${process.env.API_BASE_URL}/api/image/${fileName}`;
      return {
        fileName,
        url,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error with uploading images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const bucketName = 'upload-image-nest-blog';
    const bucket = storage.bucket(bucketName);

    const [files] = await bucket.getFiles();
    const allFileNames = files.map((file) => file.name);

    return allFileNames;
  }

  async findOne(fileName: string, res: Response) {
    const bucketName = 'upload-image-nest-blog';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const exists = await file.exists();
    if (!exists[0]) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    const stream = file.createReadStream();
    stream.pipe(res);
  }

  async remove(fileName: string) {
    const bucketName = 'upload-image-nest-blog';
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const exists = await file.exists();
    if (exists[0]) {
      await file.delete();
      return fileName;
    } else {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
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
    const bucketName = 'upload-image-nest-blog';
    const bucket = storage.bucket(bucketName);

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
