import { Roles } from 'src/user-roles/entities/user-role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
