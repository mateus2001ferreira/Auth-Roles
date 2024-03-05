import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAuthTokenDto {
  @IsNotEmpty()
  @IsString()
  bearer_token: string;

  @IsNotEmpty()
  @IsNumber()
  expires_at: Date;

  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
