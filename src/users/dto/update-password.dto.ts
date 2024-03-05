import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class updatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  repeatNewPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  continueLogged: boolean;
}
