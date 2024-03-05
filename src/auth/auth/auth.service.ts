import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { AuthTokensService } from '../auth_tokens/auth_tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authTokenService: AuthTokensService,
  ) {}

  async login(req): Promise<UserToken> {
    const user = req.user;
    const payload: UserPayload = {
      sub: user.id,
      name: user.fullName,
      email: user.email,
      roles: user.rolesName,
    };

    const jwtToken = this.jwtService.sign(payload);
    const decodedToken = this.jwtService.decode(jwtToken);

    const expires = new Date(decodedToken.exp * 1000);

    await this.authTokenService.create({
      bearer_token: jwtToken,
      expires_at: expires,
      ip: req.ip,
      platform: req.headers['user-agent'],
      userId: decodedToken.sub,
    });

    return {
      access_token: jwtToken,
    };
  }

  async logout(req) {
    try {
      const authorizationHeader = req.headers.authorization;
      const [bearer, token] = authorizationHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Formato de token inválido.');
      }

      await this.authTokenService.remove(token);

      return 'Logout realizado com sucesso';
    } catch (error) {
      throw new InternalServerErrorException('Erro interno do servidor');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Usuário ou Senha inválidos');
      }

      const IsPasswordValid = await bcrypt.compare(password, user.password);

      if (IsPasswordValid == false) {
        throw new UnauthorizedException('Usuário ou Senha inválidos');
      }
      return { ...user, password: undefined };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
    }
  }
  async refresh(req) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new BadRequestException('Forneça um token');
      }
      const [bearer, token] = authorizationHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Formato de token inválido.');
      }

      const verify = await this.authTokenService.verifyRefresh(
        token,
        req.ip,
        req.headers['user-agent'],
      );

      if (!verify) {
        throw new UnauthorizedException('Token inválido');
      }
      return await this.login(verify);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
