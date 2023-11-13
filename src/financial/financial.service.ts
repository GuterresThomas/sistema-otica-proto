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
import { ClosedCashHistory } from './models/closed_cash_history.entity';




@Injectable()
export class FinancialService {

}


@Injectable()
export class ClosedCashHistoryService {
  constructor(
    @InjectRepository(ClosedCashHistory)
    private readonly closedCashHistoryRepository: Repository<ClosedCashHistory>,
  
  ){}

  async createClosedCashHistory(closedCashHistory: ClosedCashHistory): Promise<ClosedCashHistory> {
    closedCashHistory.opened_at = new Date();
    
    return this.closedCashHistoryRepository.save(closedCashHistory);
  }
}


@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,

     private readonly closedCashHistoryService: ClosedCashHistoryService,
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
    const existingCash = await this.getCashByEmployee(employee);
  
    // Se um caixa existente estiver fechado, reabre o caixa atual
    if (existingCash && existingCash.isClosed) {
      existingCash.isClosed = false;
      existingCash.openedAt = new Date();
      await this.cashRepository.save(existingCash);
    } else {
      // Se não houver um caixa existente, cria um novo caixa aberto
      const newCash = new Cash();
      newCash.employee = employee;
      newCash.isClosed = false;
      newCash.openedAt = new Date();
      await this.cashRepository.save(newCash);
    }
  }

  async isCashOpen(employee: Employee): Promise<boolean> {
    // Obtenha o caixa para o funcionário
    const cash = await this.getCashByEmployee(employee);
  
    // Verifica se o caixa está aberto
    return !!cash && !cash.isClosed;
  }
  

  async closeCash(employee: Employee): Promise<void> {
    const cash = await this.getCashByEmployee(employee);
  
    if (!cash) {
      throw new NotFoundException('Cash not found for this user.');
    }
  
    cash.isClosed = true;
    cash.closedAt = new Date();
  
    // Salve a entidade existente para fechar o caixa atual
    await this.cashRepository.save(cash);
  
    const closedCashHistory = new ClosedCashHistory();
    closedCashHistory.employee = employee;
    closedCashHistory.balance_in_cents = cash.balance_in_cents;
    closedCashHistory.closed_at = cash.closedAt; // ou use new Date() se preferir uma nova data
    await this.closedCashHistoryService.createClosedCashHistory(closedCashHistory);
  }
  

 /* async createNewCash(employee: Employee): Promise<Cash> {
    const newCash = new Cash();
    newCash.employee = employee;
    newCash.isClosed = false;
    newCash.openedAt = new Date();
    return this.cashRepository.save(newCash);
  } */
  


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
    
    
    private readonly closedCashHistoryService: ClosedCashHistoryService,
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
    
    const cashService = new CashService(this.cashRepository, this.closedCashHistoryService);

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