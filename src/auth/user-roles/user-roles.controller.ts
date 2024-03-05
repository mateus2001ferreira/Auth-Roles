import { Controller, Get, Param } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { Roles } from './decorators/roles.decorator';
import { UserRoles } from '../auth/entities/user-roles';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Roles(UserRoles.Admin)
  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Roles(UserRoles.Admin)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userRolesService.findOne(id);
  }
}
