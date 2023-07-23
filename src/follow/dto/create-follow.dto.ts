import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty({
    example: '699e3064-3aab-478c-bb3f-a70880aedfd5',
    description: 'The ID of the following',
  })
  @IsNotEmpty()
  @IsString()
  following_id: string;
}
