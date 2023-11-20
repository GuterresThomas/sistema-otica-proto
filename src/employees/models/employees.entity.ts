import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/models/user.entity'
import { v4 as uuidv4 } from 'uuid';
import { Cash } from 'src/financial/models/cash.entity';


@Entity()
export class Employee {
[x: string]: any;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @ManyToOne(() => User, (user) => user.employees)
    @JoinColumn({ name: 'userId' })
    user: User; 

    
}