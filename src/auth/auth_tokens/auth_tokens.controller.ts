import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthTokensService } from './auth_tokens.service';
import { CreateAuthTokenDto } from './dto/create-auth_token.dto';
import { UpdateAuthTokenDto } from './dto/update-auth_token.dto';

@Controller('auth-tokens')
export class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Post()
  create(@Body() createAuthTokenDto: CreateAuthTokenDto) {
    return this.authTokensService.create(createAuthTokenDto);
  }
}
