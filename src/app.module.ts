import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/TypeORMConfig';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth/auth.module';
import { User } from './users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/user-roles/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokensModule } from './auth/auth_tokens/auth_tokens.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    JwtModule,
    AuthTokensModule,
  ],
  controllers: [],
  providers: [
    User,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
