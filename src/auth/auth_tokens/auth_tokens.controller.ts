import { Controller, Post, Body } from '@nestjs/common';
import { AuthTokensService } from './auth_tokens.service';
import { CreateAuthTokenDto } from './dto/create-auth_token.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('auth-tokens')
export class AuthTokensController {
  constructor(private readonly authTokensService: AuthTokensService) {}

  @Post()
  create(@Body() createAuthTokenDto: CreateAuthTokenDto) {
    return this.authTokensService.create(createAuthTokenDto);
  }
}
