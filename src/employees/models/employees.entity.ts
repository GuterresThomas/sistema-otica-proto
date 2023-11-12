import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
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


    @ManyToOne(() => User, (user) => user.employees)
    @JoinColumn({ name: 'userId' })
    user: User; 

    @OneToOne(type => Cash, cash => cash.employee, { cascade: true })
    cash: Cash;
}