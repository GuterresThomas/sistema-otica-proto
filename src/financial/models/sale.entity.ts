// sale.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../../clients/models/client.entity';  // Importe outras entidades conforme necessário
import { Product } from '../../products/models/product.entity';
import { Employee } from '../../employees/models/employees.entity';
import { Cash } from './cash.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Cash)
  @JoinColumn({ name: 'cash_id' })
  cash: Cash;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  sale_date: Date;

  @Column({ type: 'integer' })
  quantity_sold: number;

  @Column({ type: 'integer' })
  total_amount_in_cents: number;
}
