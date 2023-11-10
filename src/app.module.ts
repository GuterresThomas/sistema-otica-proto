import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', 
    }),
    DatabaseModule,
    UsersModule,
    ClientsModule,
    EmployeesModule,
    ProductsModule,
    SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
