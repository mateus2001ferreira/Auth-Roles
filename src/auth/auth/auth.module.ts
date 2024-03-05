import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthTokensService } from '../auth_tokens/auth_tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from '../auth_tokens/entities/auth_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    LocalAuthGuard,
    JwtStrategy,
    AuthTokensService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
