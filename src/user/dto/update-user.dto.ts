import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the User',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({
    example: 'john77',
    description: 'The login of the User',
  })
  @IsOptional()
  @IsString()
  login?: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the User',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
