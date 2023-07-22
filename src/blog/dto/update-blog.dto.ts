import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
    description: 'The description of the Blog',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
