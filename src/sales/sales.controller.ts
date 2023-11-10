import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './models/sale.entity';

import { CreateSaleDto } from 'src/sales/sales.service'

@Controller('api/v1/sales')

export class SalesController {
    constructor(private readonly salesService: SalesService) {}

    @Get()
    async findAll(): Promise<Sale[]> {
        return this.salesService.findAll();
    }
    @Post()
    @HttpCode(201)
    async create(@Body() sale: CreateSaleDto): Promise<Sale> {
        const createdSale = await this.salesService.create(sale);
        console.log(sale);
        return createdSale;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() sale: Sale): Promise<any> {
        await this.salesService.update(id, sale);
        return { message: 'Sale updated successfuly' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const user = await this.salesService.findOne(id);
        

        if(!user) {
            throw new NotFoundException('Sale does not exist!');
        }
        await this.salesService.delete(id);
        return { message: 'Sale deleted successfully!' };
    }
}
