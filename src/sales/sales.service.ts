import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {Sale} from './models/sale.entity';

export type CreateSaleDto = Partial<Sale> & { employeeId: string };


@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>,
      ) {}
     
      async findByEmployeeId(employeeId: string): Promise<Sale[]> {
        return this.saleRepository.find({ where: { employee: { id: employeeId } } });
    }
    
      async findAll(): Promise<Sale[]> {
        return this.saleRepository.find();
      }
    
      async findOne(id: string): Promise<Sale> {
        return this.saleRepository.findOne({ where: { id } });
      }
    
      async create(sale: CreateSaleDto): Promise<Sale> {
        const { employeeId, ...saleData } = sale;

        const newSale = this.saleRepository.create({
            ...saleData,
            id: uuidv4(),
            employee: { id: employeeId }, // Associe o funcionário usando o ID
        });

        return this.saleRepository.save(newSale);
    }
    
      async update(id: string, sale: Partial<Sale>): Promise<Sale> {
        await this.saleRepository.update(id, sale);
        return this.saleRepository.findOne({ where: { id } });
      }
    
      async delete(id: string): Promise<void> {
        await this.saleRepository.delete(id);
      }
}
