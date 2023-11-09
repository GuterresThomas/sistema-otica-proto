import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './models/employees.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController]
})
export class EmployeesModule {}
