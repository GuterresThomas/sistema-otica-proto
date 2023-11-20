import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employees/models/employees.entity';
import { User } from 'src/users/models/user.entity';

// Exemplo de entidade
@Entity()
export class ClosedCashHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  balance_in_cents: number;

  @Column({ type: 'timestamp' })
  closed_at: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  opened_at: Date;
}
