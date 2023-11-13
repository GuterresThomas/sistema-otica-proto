import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cash } from './models/cash.entity';
import { Employee } from 'src/employees/models/employees.entity';
import { Sale } from './models/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto.';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Client } from 'src/clients/models/client.entity';
import { Product } from 'src/products/models/product.entity';




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

  async isCashOpen(employee: Employee): Promise<boolean> {
    const cash = await this.getCashByEmployee(employee);
    return !!cash; // Retorna true se o caixa estiver aberto, false se estiver fechado
  }

  async closeCash(employee: Employee): Promise<void> {
    const cash = await this.getCashByEmployee(employee);

    if (!cash) {
      throw new NotFoundException('Cash not found for this user.');
    }

    await this.cashRepository.remove(cash);
  }

  async getCashByEmployee(employee: Employee): Promise<Cash | undefined> {
    return this.cashRepository.findOne({ where: { employee } });
  }

}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,
  ) {}

  async getAllSales(): Promise<Sale[]> {
    return this.saleRepository.find();
  }

  async getSaleById(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { id } });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
 

  async createSale(createSaleDto: CreateSaleDto): Promise<Sale> {
    const sale = this.saleRepository.create(createSaleDto);


    const cashService = new CashService(this.cashRepository);

     // Obter o valor total da venda
  const totalAmount = createSaleDto.total_amount_in_cents;

  // Atualizar o saldo do caixa
 const employee = { id: createSaleDto.employee_id } as Employee;
  
 const isCashOpen = await cashService.isCashOpen(employee);
 if (!isCashOpen) {
   throw new Error('Cash is closed for this employee. Open the cash before making a sale.');
 }
  // Adicionar o valor total da venda do saldo do caixa
  await cashService.updateBalance(employee, totalAmount);


    console.log(sale);
    sale.client = { id: createSaleDto.client_id } as Client;
    sale.product = { id: createSaleDto.product_id } as Product;
    sale.employee = { id: createSaleDto.employee_id } as Employee;
    sale.cash = {id: createSaleDto.cash_id } as Cash;
    return this.saleRepository.save(sale);
  }
  
  async updateSale(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.getSaleById(id);

    // Update properties of the sale entity based on updateSaleDto
    Object.assign(sale, updateSaleDto);

    return this.saleRepository.save(sale);
  }

  async deleteSale(id: string): Promise<void> {
    const sale = await this.getSaleById(id);

    await this.saleRepository.remove(sale);
  }
}