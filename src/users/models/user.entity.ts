import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cash } from '../../financial/models/cash.entity'

enum UserPermission {
    Admin = 'Admin',
    Normal = 'Normal',
  }
@Entity()
export class User {
[x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserPermission,
    default: UserPermission.Normal, // Defina um valor padrão se desejar
  })
  permissions: UserPermission;
  @Column()
  password: string;

  @Column()
  LojaId: number;

  @OneToOne(type => Cash, cash => cash.user, { cascade: true })
  cash: Cash;
}