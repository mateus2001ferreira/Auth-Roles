import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(user): UserToken {
    const payload: UserPayload = {
      sub: user.id,
      name: user.fullName,
      email: user.email,
      roles: user.rolesName,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
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
}
