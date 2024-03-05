import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/logout')
  async logout(@Request() req: AuthRequest) {
    return await this.authService.logout(req);
  }

  @IsPublic()
  @Post('/refresh')
  async refresh(@Request() req: AuthRequest) {
    return await this.authService.refresh(req);
  }
}
