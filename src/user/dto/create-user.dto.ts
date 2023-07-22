import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the User',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'john77',
    description: 'The login of the User',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
