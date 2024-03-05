import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repeatPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
