import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {Product} from './models/product.entity';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
      ) {}
    
      async findAll(): Promise<Product[]> {
        return this.productRepository.find();
      }
    
      async findOne(id: string): Promise<Product> {
        return this.productRepository.findOne({ where: { id } });
      }
    
      async create(product: Partial<Product>): Promise<Product> {
        const newProduct = this.productRepository.create({
            ...product,
            id: uuidv4(), // Gere um novo UUID e atribua-o à propriedade id
          });
          return this.productRepository.save(newProduct);
      }
    
      async update(id: string, product: Partial<Product>): Promise<Product> {
        await this.productRepository.update(id, product);
        return this.productRepository.findOne({ where: { id } });
      }
    
      async delete(id: string): Promise<void> {
        await this.productRepository.delete(id);
      }
}
