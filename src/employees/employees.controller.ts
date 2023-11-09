import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './models/employees.entity';

@Controller('api/v1/employees')

export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {}

    @Get()
    async findAll(): Promise<Employee[]> {
        return this.employeesService.findAll();
    }
    @Post()
    @HttpCode(201)
    async create(@Body() employee: Employee): Promise<Employee> {
        const createdEmployee = await this.employeesService.create(employee);
        console.log(employee);
        return createdEmployee;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() employee: Employee): Promise<any> {
        await this.employeesService.update(id, employee);
        return { message: 'Employee updated successfuly' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const user = await this.employeesService.findOne(id);
        

        if(!user) {
            throw new NotFoundException('Employee does not exist!');
        }
        await this.employeesService.delete(id);
        return { message: 'Employee deleted successfully!' };
    }
}
