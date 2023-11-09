import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {Client} from './models/client.entity';


@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
      ) {}
    
      async findAll(): Promise<Client[]> {
        return this.clientRepository.find();
      }
    
      async findOne(id: string): Promise<Client> {
        return this.clientRepository.findOne({ where: { id } });
      }
    
      async create(client: Partial<Client>): Promise<Client> {
        const newClient = this.clientRepository.create({
            ...client,
            id: uuidv4(), // Gere um novo UUID e atribua-o à propriedade id
          });
          return this.clientRepository.save(newClient);
      }
    
      async update(id: string, client: Partial<Client>): Promise<Client> {
        await this.clientRepository.update(id, client);
        return this.clientRepository.findOne({ where: { id } });
      }
    
      async delete(id: string): Promise<void> {
        await this.clientRepository.delete(id);
      }
}
