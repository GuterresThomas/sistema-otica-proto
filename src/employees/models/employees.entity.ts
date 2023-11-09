import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity'
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    comission: number;

    @ManyToOne(() => User, (user) => user.employees)
    @JoinColumn({ name: 'userId' })
    user: User; 
}