import { Controller, Get, Param } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/auth/entities/user-roles';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Roles(UserRoles.Master)
  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Roles(UserRoles.Master)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userRolesService.findOne(id);
  }
}
