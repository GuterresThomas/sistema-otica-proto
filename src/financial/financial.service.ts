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
import { PayableAccount } from './models/payable_account.entity';
import { ReceivableAccount } from './models/receivable_account.entity';
import { CreatePayableAccountDto } from './dto/create-payable-account.dto';
import { CreateReceivableAccountDto } from './dto/create-receivable-account.dto';
import { validateOrReject } from 'class-validator';
import { User } from 'src/users/models/user.entity';
import { format, parseISO } from 'date-fns';






@Injectable()
export class FinancialService {
closedCashHistoryService: ClosedCashHistoryService;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,
    @InjectRepository(ClosedCashHistory)
    private readonly closedCashHistoryRepository: Repository<ClosedCashHistory>,
    @InjectRepository(PayableAccount)
    private readonly payableAccountRepository: Repository<PayableAccount>,
    @InjectRepository(ReceivableAccount)
    private readonly receivableAccountRepository: Repository<ReceivableAccount>,
    
  ) {}

  
  async createPayableAccount(createPayableAccountDto: CreatePayableAccountDto): Promise<PayableAccount> {
      console.log('Valores e tipos antes da validação do DTO:');
      console.log('amount_in_cents:', createPayableAccountDto.amount_in_cents, typeof createPayableAccountDto.amount_in_cents);
      console.log('due_date:', createPayableAccountDto.due_date, typeof createPayableAccountDto.due_date);
      console.log('is_open:', createPayableAccountDto.is_open, typeof createPayableAccountDto.is_open);
      console.log('paid:', createPayableAccountDto.paid, typeof createPayableAccountDto.paid);
      console.log('user_id:', createPayableAccountDto.user_id, typeof createPayableAccountDto.user_id);
      console.log('cash_id:', createPayableAccountDto.cash_id, typeof createPayableAccountDto.cash_id);
      
      const { user_id, cash_id, due_date, ...rest } = createPayableAccountDto;


      const formattedDueDate: string = createPayableAccountDto.due_date.toString();
      const formattedDueDateToIso = parseISO(formattedDueDate);
      const parsedFormattedDueDate = format(formattedDueDateToIso, 'yyyy-MM-dd')

    // Verifica se o usuário e o caixa associados existem antes de criar a nova conta a pagar
    const user = await this.userRepository.findOne({ where: { id: user_id}});
    const cash = await this.cashRepository.findOne({ where: { id: cash_id } });
    if (!user || !cash) {
      throw new Error('Usuário ou caixa não encontrado');
    }

    const newPayableAccount = this.payableAccountRepository.create({
      ...rest,
      user,
      cash,
      due_date: parsedFormattedDueDate,
    });

    await this.updateBalanceForPaidAccounts();

    return await this.payableAccountRepository.save(newPayableAccount);
  }
  
  async updateBalanceForPaidAccounts(): Promise<void> {
    // Busca por contas a pagar que estão fechadas e pagas
    const paidAccounts = await this.payableAccountRepository.find({
      where: {
        is_open: false,
        paid: true,
      },
      relations: ['cash'], // Adiciona a relação com a entidade Cash
    });

    for (const account of paidAccounts) {
      // Obtém o caixa associado à conta a pagar
      const cash = account.cash; // Supondo que a relação se chame 'cash'
  
      if (cash) {
        cash.balance_in_cents -= account.amount_in_cents;
        await this.cashRepository.save(cash);
      }

    }
  }
  
  async createReceivableAccount(createReceivableAccountDto: CreateReceivableAccountDto): Promise<ReceivableAccount> {
    console.log('Valores e tipos antes da validação do DTO:');
      console.log('amount_in_cents:', createReceivableAccountDto.amount_in_cents, typeof createReceivableAccountDto.amount_in_cents);
      console.log('due_date:', createReceivableAccountDto.due_date, typeof createReceivableAccountDto.due_date);
      console.log('is_open:', createReceivableAccountDto.is_open, typeof createReceivableAccountDto.is_open);
      console.log('received:', createReceivableAccountDto.received, typeof createReceivableAccountDto.received);
      console.log('user_id:', createReceivableAccountDto.user_id, typeof createReceivableAccountDto.user_id);
      console.log('cash_id:', createReceivableAccountDto.cash_id, typeof createReceivableAccountDto.cash_id);
      
      const { user_id, cash_id, due_date, ...rest } = createReceivableAccountDto;

    
      const formattedDueDate: string = createReceivableAccountDto.due_date.toString();
      const formattedDueDateToIso = parseISO(formattedDueDate);
      const parsedFormattedDueDate = format(formattedDueDateToIso, 'yyyy-MM-dd')

        // Verifica se o usuário e o caixa associados existem antes de criar a nova conta a receber
        const user = await this.userRepository.findOne({ where: { id: user_id}});
        const cash = await this.cashRepository.findOne({ where: { id: cash_id } });
        if (!user || !cash) {
          throw new Error('Usuário ou caixa não encontrado');
        }

        const newReceivableAccount = this.receivableAccountRepository.create({
          ...rest,
          user,
          cash,
          due_date: parsedFormattedDueDate,
        });


        await this.updateBalanceForReceivedAccounts();

    return this.receivableAccountRepository.save(newReceivableAccount);
  }

  async updateBalanceForReceivedAccounts(): Promise<void> {
    // Busca por contas a pagar que estão fechadas e pagas
    const receivedAccounts = await this.receivableAccountRepository.find({
      where: {
        is_open: false,
        received: true,
      },
      relations: ['cash'], // Adiciona a relação com a entidade Cash
    });

    for (const account of receivedAccounts) {
      console.log('Account:', account);
      const cash = account.cash;
    
      if (cash) {
        console.log('Cash:', cash);
        cash.balance_in_cents += account.amount_in_cents;
        console.log('New Cash Balance:', cash.balance_in_cents);
    
        await this.cashRepository.save(cash);
      }
    }
  }

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
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    if (createSaleDto.product_id && createSaleDto.quantity_sold && createSaleDto.cash_id) {
      const product = await this.productRepository.findOne({ where: { id: createSaleDto.product_id } });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.move_stock) {
        if (product.stock < createSaleDto.quantity_sold) {
          throw new Error('Insufficient stock');
        }

        product.stock -= createSaleDto.quantity_sold;
        await this.productRepository.save(product);
      }
    }

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