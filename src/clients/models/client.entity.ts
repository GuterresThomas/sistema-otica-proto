import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

enum TypeCLient {
    PF = 'Pf',
    PJ = 'Pj',
  }
@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cpf_cnpj: string;

  @Column()
  address: string;
  
  @Column()
  observations: string;

  @Column({
    type: 'enum',
    enum: TypeCLient,
  })
  types: TypeCLient;
}