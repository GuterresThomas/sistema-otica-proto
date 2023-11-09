import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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
}