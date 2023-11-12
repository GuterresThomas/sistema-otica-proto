import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity';

@Entity()
export class Cash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;
}
