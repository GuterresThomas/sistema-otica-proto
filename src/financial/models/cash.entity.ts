import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Employee } from 'src/employees/models/employees.entity';


@Entity()
export class Cash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  balance_in_cents: number;

  @ManyToOne(type => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  openedAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  closedAt: Date;
}
