import { Injectable } from '@nestjs/common';
import { Roles } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly UserRoleRepository: Repository<Roles>,
  ) {}
  findAll() {
    return `This action returns all userRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }
}
