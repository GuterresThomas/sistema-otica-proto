import { Module } from '@nestjs/common';
import { CashService, FinancialService, SalesService } from './financial.service';
import { CashController, FinancialController, SalesController } from './financial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from './models/cash.entity';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/models/employees.entity';
import { Sale } from './models/sale.entity';






@Module({
  imports: [TypeOrmModule.forFeature([Cash, Employee, Sale])],
  providers: [FinancialService, CashService, EmployeesService, SalesService],
  controllers: [FinancialController, CashController, SalesController]
})
export class FinancialModule {}
