import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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
    description: 'The username of the User',
  })
  @IsOptional()
  @IsString()
  username?: string;

  // @ApiProperty({
  //   example: 'john77@gmail.com',
  //   description: 'The login of the User',
  // })
  // @IsOptional()
  // @IsEmail()
  // email?: string;

  @ApiProperty({
    example: 'Uzbek1&t0n',
    description: 'The password of the User',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
