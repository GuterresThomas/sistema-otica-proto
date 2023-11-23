import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, Res, HttpStatus, InternalServerErrorException } from '@nestjs/common';
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
    

        @Get('status/:userId')
        async checkCashStatus(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
            try {
                const user = await this.findUser(userId);
                const isCashOpen = await this.cashService.isCashOpen(user);
    
                res.status(HttpStatus.OK).json({ isCashOpen });
            } catch (error) {
                console.error('Erro ao verificar status do caixa:', error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao verificar status do caixa' });
            }
        }

        @Get('balance/:userId')
        async getBalanceById(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
          const user = await this.findUser(userId);
      
          const balance = await this.cashService.getBalance(user);
      
          res.status(HttpStatus.OK).json({ balance });
        }

        @HttpCode(201)
@Post('open/:userId/:initialBalance')
async openCash(@Param('userId') userId: string, @Param('initialBalance') initialBalance: number, @Res() res: Response): Promise<void> {
  try {
    const user = await this.userService.findOne(userId);

    const result = await this.cashService.openCash(user, initialBalance);

    if (result.success && result.cashId) {
      const openedCash = new Date().toLocaleString();
      console.log(`Cash opened at: ${openedCash}`);

      res.status(201).json({
        success: true,
        message: 'Caixa aberto com sucesso',
        cashId: result.cashId,
      });
    } else {
      throw new Error('Erro ao abrir o caixa');
    }
  } catch (error) {
    console.error('Erro ao abrir o caixa:', error);
    res.status(500).json({ error: 'Erro ao abrir o caixa' });
  }
}
        
        @HttpCode(201)
        @Post('close/:userId')
        async closeCash(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
          try {
            const user = await this.findUser(userId);
            await this.cashService.closeCash(user);
        
            const closedAt = new Date().toLocaleString();
            console.log(`cash closed at: ${closedAt}`);
        
            res.status(201).json({ message: 'Caixa fechado com sucesso' });
          } catch (error) {
            console.error('Erro ao fechar o caixa:', error);
            res.status(500).json({ error: 'Erro ao fechar o caixa' });
          }
        }

  private async findUser(userId: string): Promise<User> {
    // Implemente a lógica para encontrar o usuário no seu serviço de usuário ou banco de dados
    // Este é um exemplo básico, você pode ajustar conforme necessário
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Get()
  async getBalance(user: User): Promise<number> {
      
    return this.cashService.getBalance(user);
  }
  
}

@Controller('api/v1/sales')
export class SalesController{
  constructor(
    private readonly salesService: SalesService,
    private readonly userService: UsersService,
    private readonly cashService: CashService,
    ) {}

  @Get()
  async getAllSales(): Promise<Sale[]> {
    return this.salesService.getAllSales();
  }

  @Get('status/:userId')
  async checkCashStatus(@Param('userId') userId: string): Promise<boolean> {
    try {
      const user = await this.userService.findOne(userId);
      return await this.cashService.checkCashStatus(user);
    } catch (error) {
      console.error('Erro ao verificar status do caixa:', error);
      throw new InternalServerErrorException('Erro ao verificar status do caixa');
    }
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

