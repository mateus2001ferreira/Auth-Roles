import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../entities/user-roles';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../models/UserPayload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly JwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;
    const token = authorization.replace('Bearer ', '');

    const payload: UserPayload = await this.JwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    }).catch(() => undefined);

    if (!payload) {
      return false;
    }

    return payload.roles.some((role) => requiredRoles.includes(role));
  }
}
