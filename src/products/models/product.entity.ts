import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    intern_code: string;

    @Column()
    move_stock: boolean;
    @Column()
    cost_value_in_cents: number;
    
    @Column()
    sale_value_in_cents: number;

    @Column()
    stock: number;
    
    @Column()
    ncm: string;
}