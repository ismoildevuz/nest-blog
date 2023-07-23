import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'New Title',
    description: 'The title of the Blog',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The body of the Blog',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  // @ApiProperty({
  //   example: 'https://picsum.photos/id/128/200/300',
  //   description: 'The image url of the Blog',
  // })
  // @IsNotEmpty()
  // @IsUrl()
  // image_url: string;

  @ApiProperty({
    example: '699e3064-3aab-478c-bb3f-a70880aedfd5',
    description: 'The user ID of the Blog',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
