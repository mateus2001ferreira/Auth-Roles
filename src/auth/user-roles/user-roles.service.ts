import { Injectable, NotFoundException } from '@nestjs/common';
import { Roles } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly UserRoleRepository: Repository<Roles>,
  ) {}
  async findAll() {
    try {
      return await this.UserRoleRepository.find();
    } catch (error) {
      throw new NotFoundException('Erro ao buscar permissões');
    }
  }

  async findOne(id: number) {
    try {
      return await this.UserRoleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Erro ao buscar permissão');
    }
  }
}
