import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {Sale} from './models/sale.entity';


@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>,
      ) {}
    
      async findAll(): Promise<Sale[]> {
        return this.saleRepository.find();
      }
    
      async findOne(id: string): Promise<Sale> {
        return this.saleRepository.findOne({ where: { id } });
      }
    
      async create(sale: Partial<Sale>): Promise<Sale> {
        const newSale = this.saleRepository.create({
            ...sale,
            id: uuidv4(), // Gere um novo UUID e atribua-o à propriedade id
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
