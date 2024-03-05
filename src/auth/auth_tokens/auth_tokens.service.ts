import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthTokenDto } from './dto/create-auth_token.dto';
import { UpdateAuthTokenDto } from './dto/update-auth_token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth_token.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokensService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthTokenDto: CreateAuthTokenDto) {
    try {
      const exists = await this.authTokenRepository.find({
        where: {
          ip: createAuthTokenDto.ip,
          platform: createAuthTokenDto.platform,
          userId: createAuthTokenDto.userId,
        },
      });

      if (exists.length > 0) {
        const updateAuthToken = {
          bearer_token: createAuthTokenDto.bearer_token,
          expires_at: createAuthTokenDto.expires_at,
        };
        await this.update(exists[0].id, updateAuthToken);
        return true;
      }
      await this.authTokenRepository.save(createAuthTokenDto);
      return true;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
  async update(id: number, updateAuthTokenDto: UpdateAuthTokenDto) {
    try {
      await this.authTokenRepository.update({ id }, updateAuthTokenDto);
      return true;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async verify(authToken) {
    try {
      const exists = await this.authTokenRepository.findOne({
        where: { bearer_token: authToken },
      });
      if (!exists) {
        return false;
      }
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Erro interno do Servidor');
    }
  }

  async verifyRefresh(bearer_token, ip, platform) {
    const token = await this.authTokenRepository.findOne({
      where: { bearer_token: bearer_token, ip: ip, platform: platform },
    });

    if (!token) {
      throw new UnauthorizedException('Token Inválido');
    }

    const user = await this.jwtService.decode(bearer_token);

    return {
      user: {
        id: user.sub,
        fullName: user.name,
        email: user.email,
        rolesName: user.roles,
      },
      headers: {
        'user-agent': platform,
      },
    };
  }

  async remove(token: string) {
    await this.authTokenRepository.delete({
      bearer_token: token,
    });
  }
}
