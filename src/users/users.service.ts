import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { updatePasswordDto } from './dto/update-password.dto';
import { AuthTokensService } from 'src/auth/auth_tokens/auth_tokens.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authTokenService: AuthTokensService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      if (
        (await this.userRepository.findOne({
          where: { email: createUserDto.email },
        })) != null
      ) {
        throw new ConflictException('Email já cadastrado');
      }
      if (createUserDto.password != createUserDto.repeatPassword) {
        throw new ConflictException('As senhas não conferem');
      }

      delete createUserDto.repeatPassword;
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        Number(process.env.SALT_ROUNDS),
      );

      const newUser = await this.userRepository.save(createUserDto);

      return { ...newUser, password: undefined };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Erro interno do servidor');
      }
    }
  }

  async updatePassword(reqUser: User, updatePasswordDto: updatePasswordDto) {
    try {
      if (
        updatePasswordDto.newPassword != updatePasswordDto.repeatNewPassword
      ) {
        throw new BadRequestException(
          'Nova senha e repetir nova senha precisam ser iguais',
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: reqUser.id },
      });

      if (
        (await bcrypt.compareSync(
          updatePasswordDto.newPassword,
          user.password,
        )) == true
      ) {
        throw new ConflictException('Nova senha não pode ser igual a antiga');
      }

      if (
        (await bcrypt.compareSync(updatePasswordDto.password, user.password)) ==
        false
      ) {
        throw new ConflictException('Senha atual incorreta');
      }

      const newPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        Number(process.env.SALT_ROUNDS),
      );

      await this.userRepository.update(user.id, {
        password: newPassword,
      });

      if (updatePasswordDto.continueLogged == true) {
        return { message: 'Senha alterada com sucesso', statusCode: 200 };
      }

      return await this.authTokenService.remove(user.id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      } else {
        throw new InternalServerErrorException('Erro interno do servidor');
      }
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { email: email },
      });
      const roles = await this.userRepository.query(
        `SELECT "rolesId", "userId"
    FROM public.many_user_has_many_roles WHERE "userId" = $1`,
        [user.id],
      );

      const userRoleIds = roles.map((role) => role.rolesId);
      const rolesName = [];

      await Promise.all(
        userRoleIds.map(async (roleId) => {
          const query = `SELECT name FROM public.roles WHERE id = ${roleId};`;
          const result = await this.userRepository.query(query);
          if (result.length > 0) {
            rolesName.push(result[0].name);
          }
        }),
      );

      return { ...user, rolesName };
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
