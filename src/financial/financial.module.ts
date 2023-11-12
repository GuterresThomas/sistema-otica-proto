import { Module } from '@nestjs/common';
import { CashService, FinancialService } from './financial.service';
import { CashController, FinancialController } from './financial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from './models/cash.entity';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/models/employees.entity';






@Module({
  imports: [TypeOrmModule.forFeature([Cash, Employee])],
  providers: [FinancialService, CashService, EmployeesService],
  controllers: [FinancialController, CashController]
})
export class FinancialModule {}
