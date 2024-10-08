import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from 'src/auth/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/auth/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Roles } from 'src/auth/user-roles/decorators/roles.decorator';
import { UserRoles } from 'src/auth/auth/entities/user-roles';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { updatePasswordDto } from './dto/update-password.dto';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'Adicionar usuário' })
  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ description: 'Alterar a senha do usuário' })
  @Post('update-password')
  async updatePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: updatePasswordDto,
  ) {
    return await this.usersService.updatePassword(user, updatePasswordDto);
  }

  @ApiExcludeEndpoint()
  @IsPublic()
  @Get('/findByEmail/:email')
  async findUserByEmail(@Param('email') email: string) {
    return await this.usersService.findUserByEmail(email);
  }

  @ApiExcludeEndpoint()
  @Roles(UserRoles.Admin, UserRoles.User)
  @Get('/teste')
  teste(@CurrentUser() user: User) {
    return user;
  }
}
