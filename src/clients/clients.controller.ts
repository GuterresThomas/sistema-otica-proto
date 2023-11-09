import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './models/client.entity';

@Controller('api/v1/clients')

export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Get()
    async findAll(): Promise<Client[]> {
        return this.clientsService.findAll();
    }
    @Post()
    @HttpCode(201)
    async create(@Body() client: Client): Promise<Client> {
        const createdClient = await this.clientsService.create(client);
        console.log(client);
        return createdClient;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() client: Client): Promise<any> {
        await this.clientsService.update(id, client);
        return { message: 'Client updated successfuly' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const user = await this.clientsService.findOne(id);
        

        if(!user) {
            throw new NotFoundException('Client does not exist!');
        }
        await this.clientsService.delete(id);
        return { message: 'Client deleted successfully!' };
    }
}
