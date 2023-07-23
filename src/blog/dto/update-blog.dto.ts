import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty({
    example: 'New Title',
    description: 'The title of the Blog',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The body of the Blog',
  })
  @IsOptional()
  @IsString()
  body?: string;

  // @ApiProperty({
  //   example: 'https://picsum.photos/id/128/200/300',
  //   description: 'The image url of the Blog',
  // })
  // @IsOptional()
  // @IsUrl()
  // image_url?: string;
}
