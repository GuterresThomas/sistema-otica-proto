import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.entity';

@Controller('api/v1/users')

export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
    @Post()
    @HttpCode(201)
    async create(@Body() user: User): Promise<User> {
        const createdUser = await this.usersService.create(user);
        console.log(user);
        return createdUser;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: User): Promise<any> {
        await this.usersService.update(id, user);
        return { message: 'User updated successfuly' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const user = await this.usersService.findOne(id);
        

        if(!user) {
            throw new NotFoundException('User does not exist!');
        }
        await this.usersService.delete(id);
        return { message: 'User deleted successfully!' };
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }): Promise<{ token: string }> {
        const { email, password } = body;

        const token = await this.usersService.login(email, password);

        if (!token) {
            throw new NotFoundException('Credenciais inválidas');
        }

        return { token };
    }

    
}
