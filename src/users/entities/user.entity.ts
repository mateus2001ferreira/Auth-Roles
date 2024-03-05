import { AuthToken } from 'src/auth/auth_tokens/entities/auth_token.entity';
import { Roles } from 'src/auth/user-roles/entities/user-role.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @ManyToMany(() => Roles)
  roles: Roles[];

  @OneToMany(() => AuthToken, (token) => token.user)
  tokenId: AuthToken[];
}
