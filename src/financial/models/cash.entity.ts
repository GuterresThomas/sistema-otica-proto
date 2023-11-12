import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from 'src/employees/models/employees.entity';


@Entity()
export class Cash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  balance_in_cents: number;

  @OneToOne(type => Employee)
  @JoinColumn()
  employee: Employee;
}
