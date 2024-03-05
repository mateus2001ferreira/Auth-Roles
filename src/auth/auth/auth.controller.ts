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
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Login' })
  @ApiBody({ type: typeof { email: ' ', password: '' } })
  @IsPublic()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req);
  }

  @ApiOperation({ description: 'Logout: Enviar bearer token' })
  @HttpCode(HttpStatus.OK)
  @Get('/logout')
  async logout(@Request() req: AuthRequest) {
    return await this.authService.logout(req);
  }

  @ApiOperation({ description: 'Refresh: Enviar bearer token' })
  @IsPublic()
  @Post('/refresh')
  async refresh(@Request() req: AuthRequest) {
    return await this.authService.refresh(req);
  }
}
