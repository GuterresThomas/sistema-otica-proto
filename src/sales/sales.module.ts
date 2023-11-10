import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './models/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale])],
  providers: [SalesService],
  controllers: [SalesController]
})
export class SalesModule {}
