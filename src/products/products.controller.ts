import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './models/product.entity';

@Controller('api/v1/products')

export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productsService.findAll();
    }
    @Post()
    @HttpCode(201)
    async create(@Body() product: Product): Promise<Product> {
        const createdProduct = await this.productsService.create(product);
        console.log(product);
        return createdProduct;
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Product | { message: string }> {
        const product = await this.productsService.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found!');
        }
        return product;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() product: Product): Promise<any> {
        await this.productsService.update(id, product);
        return { message: 'Product updated successfuly' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const user = await this.productsService.findOne(id);
        

        if(!user) {
            throw new NotFoundException('Product does not exist!');
        }
        await this.productsService.delete(id);
        return { message: 'Product deleted successfully!' };
    }
}
