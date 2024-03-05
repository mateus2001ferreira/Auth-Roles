import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  bearer_token: string;

  @Column({ nullable: false })
  expires_at: Date;

  @Column({ nullable: false })
  ip: string;

  @Column({ nullable: false })
  platform: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tokenId, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
