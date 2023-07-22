import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    description: 'The description of the Blog',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '699e3064-3aab-478c-bb3f-a70880aedfd5',
    description: 'The user ID of the Blog',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
