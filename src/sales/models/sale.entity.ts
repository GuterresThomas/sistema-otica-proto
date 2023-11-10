import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { Employee } from '../../employees/models/employees.entity'
import { v4 as uuidv4 } from 'uuid';
import { Product } from 'src/products/models/product.entity';

enum Situation {
    Confirmed = 'Confirmed',
    Opened = 'Opened',
    Canceled = 'Canceled',
    InProgress = 'InProgress',
}

@Entity()
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('date') // Data
    data: Date;

    @Column({
        type: 'enum',
        enum: Situation,
    }) 
    situacao: Situation;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[];
    
    @ManyToOne(() => Employee, (employee) => employee.sales)
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column('int', { array: true, nullable: true })
    comissions_in_cents: number[]; // Coluna de array para armazenar as comissões
}
