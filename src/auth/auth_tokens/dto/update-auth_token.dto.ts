import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthTokenDto } from './create-auth_token.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthTokenDto {
  @IsNotEmpty()
  @IsString()
  bearer_token: string;

  @IsNotEmpty()
  @IsDate()
  expires_at: Date;
}
