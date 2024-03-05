import { Module } from '@nestjs/common';
import { AuthTokensService } from './auth_tokens.service';
import { AuthTokensController } from './auth_tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth_token.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken])],
  controllers: [AuthTokensController],
  providers: [AuthTokensService, JwtService],
  exports: [AuthTokensService],
})
export class AuthTokensModule {}
