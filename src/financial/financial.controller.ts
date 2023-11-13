import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { CashService, FinancialService, SalesService } from './financial.service';
import { User } from 'src/users/models/user.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/models/employees.entity';
import { Cash } from './models/cash.entity';
import { Sale } from './models/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto.';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Response } from 'express'; // Ensure you import Response from 'express'


@Controller('api/v1/financial')
export class FinancialController {}

@Controller('api/v1/cash')
export class CashController {

    constructor(
        private readonly employeeService: EmployeesService,
        private readonly cashService: CashService
        ) {}
    
  @HttpCode(201)  
  @Post('open/:employeeId')
  async openCash(@Param('employeeId') employeeId: string, @Res() res: Response): Promise<void> {
    const employee = await this.employeeService.findOne(employeeId);
    await this.cashService.openCash(employee);

    const openedCash = new Date().toLocaleString();

    console.log(`cash opened at: ${openedCash}`)
  }

  @HttpCode(201)
  @Post('close/:employeeId')
  async closeCash(@Param('employeeId') employeeId: string, @Res() res: Response): Promise<void> {
    const employee = await this.findEmployee(employeeId);
    await this.cashService.closeCash(employee);

    const closedAt = new Date().toLocaleString();

    console.log(`cash closed at: ${closedAt}`)
    res.json()
  }

  private async findEmployee(employeeId: string): Promise<Employee> {
    // Implemente a lógica para encontrar o usuário no seu serviço de usuário ou banco de dados
    // Este é um exemplo básico, você pode ajustar conforme necessário
    const employee = await this.employeeService.findOne(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    return employee;
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

