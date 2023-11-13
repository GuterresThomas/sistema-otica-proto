import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employees/models/employees.entity';
// Exemplo de entidade
@Entity()
export class ClosedCashHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  balance_in_cents: number;

  @Column({ type: 'timestamp' })
  closed_at: Date;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  opened_at: Date;
}
