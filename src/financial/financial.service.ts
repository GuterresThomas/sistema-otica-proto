import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cash } from './models/cash.entity';
import { Employee } from 'src/employees/models/employees.entity';





@Injectable()
export class FinancialService {

}

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,
  ) {}

  async getBalance(employee: Employee): Promise<number> {
    const cash = await this.getCashByEmployee(employee);
    return cash ? cash.balance_in_cents : 0;
  }

  async updateBalance(employee: Employee, amount: number): Promise<void> {
    let cash = await this.getCashByEmployee(employee);

    if (!cash) {
      cash = new Cash();
      cash.employee = employee;
    }

    cash.balance_in_cents += amount;

    await this.cashRepository.save(cash);
  }

  async openCash(employee: Employee): Promise<void> {
    let cash = await this.getCashByEmployee(employee);
    if (cash) {
      throw new Error('Cash is already open for this employee.');
    }

    cash = new Cash();
    cash.employee = employee;

    await this.cashRepository.save(cash);
  }

  async closeCash(employee: Employee): Promise<void> {
    const cash = await this.getCashByEmployee(employee);

    if (!cash) {
      throw new NotFoundException('Cash not found for this user.');
    }

    await this.cashRepository.remove(cash);
  }

  private async getCashByEmployee(employee: Employee): Promise<Cash | undefined> {
    return this.cashRepository.findOne({ where: { employee } });
  }

}