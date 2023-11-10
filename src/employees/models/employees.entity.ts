import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/models/user.entity'
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Employee {
[x: string]: any;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;


    @ManyToOne(() => User, (user) => user.employees)
    @JoinColumn({ name: 'userId' })
    user: User; 
}