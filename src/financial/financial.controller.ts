import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { CashService, FinancialService, SalesService } from './financial.service';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { Employee } from 'src/employees/models/employees.entity';
import { Cash } from './models/cash.entity';
import { Sale } from './models/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto.';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { CreatePayableAccountDto } from './dto/create-payable-account.dto';
import { CreateReceivableAccountDto } from './dto/create-receivable-account.dto';
import { Response } from 'express'; 


@Controller('api/v1/financial')
export class FinancialController {
  constructor(
    private readonly financialService: FinancialService
    ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('payable-accounts')
  async createPayableAccount(@Body() createPayableAccountDto: CreatePayableAccountDto, @Res() res: Response): Promise<void> {
    const createdPayableAccount = await this.financialService.createPayableAccount(createPayableAccountDto);
    res.status(HttpStatus.CREATED).json(createdPayableAccount);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('receivable-accounts')
  async createReceivableAccount(@Body() createReceivableAccountDto: CreateReceivableAccountDto, @Res() res: Response): Promise<void> {
    const createdReceivableAccount = await this.financialService.createReceivableAccount(createReceivableAccountDto);
    res.status(HttpStatus.CREATED).json(createdReceivableAccount);
  }
}

@Controller('api/v1/cash')
export class CashController {

    constructor(
        private readonly userService: UsersService,
        private readonly cashService: CashService,
        ) {}
    


        @Get('balance/:userId')
        async getBalanceById(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
          const user = await this.findUser(userId);
      
          const balance = await this.cashService.getBalance(user);
      
          res.status(HttpStatus.OK).json({ balance });
        }

  @HttpCode(201)  
  @Post('open/:employeeId')
  async openCash(@Param('employeeId') employeeId: string, @Res() res: Response): Promise<void> {
    const employee = await this.userService.findOne(employeeId);
    await this.cashService.openCash(employee);

    const openedCash = new Date().toLocaleString();

    console.log(`cash opened at: ${openedCash}`)
  }

  @HttpCode(201)
  @Post('close/:userId')
  async closeCash(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
    const user = await this.findUser(userId);
    await this.cashService.closeCash(user);

    const closedAt = new Date().toLocaleString();

    console.log(`cash closed at: ${closedAt}`)
    res.json()
  }

  private async findUser(userId: string): Promise<Employee> {
    // Implemente a lógica para encontrar o usuário no seu serviço de usuário ou banco de dados
    // Este é um exemplo básico, você pode ajustar conforme necessário
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('Employee not found.');
    }

    return user;
  }

  @Get()
  async getBalance(employee: Employee): Promise<number> {
      
    return this.cashService.getBalance(employee);
  }
  
}

@Controller('api/v1/sales')
export class SalesController{
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async getAllSales(): Promise<Sale[]> {
    return this.salesService.getAllSales();
  }

  @Get(':id')
  async getSaleById(@Param('id') id: string): Promise<Sale> {
    return this.salesService.getSaleById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createSale(@Body() createSaleDto: CreateSaleDto, @Res() res: Response): Promise<void> {
    const createdSale = await this.salesService.createSale(createSaleDto);

    res.status(HttpStatus.CREATED).json(createdSale);
  }

  @Put(':id')
  async updateSale(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Promise<Sale> {
    return this.salesService.updateSale(id, updateSaleDto);
  }

  @Delete(':id')
  async deleteSale(@Param('id') id: string, @Res() res: Response): Promise<void> {
    await this.salesService.deleteSale(id);

    res.status(HttpStatus.NO_CONTENT).json();
  }
}

