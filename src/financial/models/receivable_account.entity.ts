import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity'; // Importe outras entidades conforme necessário
import { Cash } from './cash.entity';
import { IsOptional } from 'class-validator';

enum TypeAccount {
  Boleto = 'Boleto',
  Cartao = 'Cartao',
  Crediario = 'Crediario',
  Dinheiro = 'Dinheiro',
}


@Entity()
export class ReceivableAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount_in_cents: number;
  
  @IsOptional()
  @Column({ type: 'timestamp' })
  due_date: Date;

  @Column({ type: 'boolean', default: true })
  is_open: boolean;

  @Column({ type: 'boolean', default: false })
  received: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Cash)
  @JoinColumn({ name: 'cash_id' })
  cash: Cash;

  @Column({
    type: 'enum',
    enum: TypeAccount,
    default: TypeAccount.Boleto,
  })
  types: TypeAccount;
  
}
