import { Module } from '@nestjs/common';
import { CashService, ClosedCashHistoryService, FinancialService, SalesService } from './financial.service';
import { CashController, FinancialController, SalesController } from './financial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from './models/cash.entity';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/users.service';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/models/employees.entity';
import { Sale } from './models/sale.entity';
import { ClosedCashHistory } from './models/closed_cash_history.entity';
import { PayableAccount } from './models/payable_account.entity';
import { ReceivableAccount } from './models/receivable_account.entity';
import { Product } from 'src/products/models/product.entity';
import { ProductsService } from 'src/products/products.service';








@Module({
  imports: [TypeOrmModule.forFeature([Cash, Employee, Sale, ClosedCashHistory, ClosedCashHistory, PayableAccount, ReceivableAccount, User, Product])],
  providers: [FinancialService, CashService, EmployeesService, SalesService, ClosedCashHistoryService, UsersService, ProductsService],
  controllers: [FinancialController, CashController, SalesController]
})
export class FinancialModule {}
