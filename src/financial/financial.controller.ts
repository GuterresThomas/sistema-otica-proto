import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, Res } from '@nestjs/common';
import { CashService, FinancialService } from './financial.service';
import { User } from 'src/users/models/user.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/models/employees.entity';
import { Cash } from './models/cash.entity';


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