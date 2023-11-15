import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity'; // Importe outras entidades conforme necessário
import { Cash } from './cash.entity';

@Entity()
export class PayableAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount_in_cents: number;

  @Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
  due_date: Date;

  @Column({ type: 'boolean', default: true })
  is_open: boolean;

  @Column({ type: 'boolean', default: false })
  paid: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Cash)
  @JoinColumn({ name: 'cash_id' })
  cash: Cash;

}
