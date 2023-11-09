import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {Employee} from './models/employees.entity';


@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
      ) {}
    
      async findAll(): Promise<Employee[]> {
        return this.employeeRepository.find();
      }
    
      async findOne(id: string): Promise<Employee> {
        return this.employeeRepository.findOne({ where: { id } });
      }
    
      async create(employee: Partial<Employee>): Promise<Employee> {
        const newEmployee = this.employeeRepository.create({
            ...employee,
            id: uuidv4(), // Gere um novo UUID e atribua-o à propriedade id
          });
          return this.employeeRepository.save(newEmployee);
      }
    
      async update(id: string, employee: Partial<Employee>): Promise<Employee> {
        await this.employeeRepository.update(id, employee);
        return this.employeeRepository.findOne({ where: { id } });
      }
    
      async delete(id: string): Promise<void> {
        await this.employeeRepository.delete(id);
      }
}
