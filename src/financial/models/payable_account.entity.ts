import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity'; // Importe outras entidades conforme necessário
import { Cash } from './cash.entity';

enum TypeAccount {
  Boleto = 'Boleto',
  Cartao = 'Cartao',
  Crediario = 'Crediario',
  Dinheiro = 'Dinheiro',
}


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

  @Column({ type: 'varchar', length: 50, default: 'TipoPadrao' })
  TipoDespesa: string;
  
  @Column({type: 'varchar', length: 50, default: 'Mensal' })
  Occurrence: string;

  @Column({
    type: 'enum',
    enum: TypeAccount,
    default: TypeAccount.Boleto,
  })
  account_type: TypeAccount;
  
  @Column({type: 'varchar', length: 50, default: 'Anexo' })
  Attachments: string; // Consider using another type like BLOB for file storage

  @Column({type: 'varchar', length: 50, default: 'DescricaoPadrao' })
  ExpenseDescription: string;

}
