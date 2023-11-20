import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employees/models/employees.entity';
import { User } from 'src/users/models/user.entity';


@Entity()
export class Cash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  balance_in_cents: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  openedAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  closedAt: Date;

}
