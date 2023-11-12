import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/models/user.entity'; 
import { Client } from '../clients/models/client.entity';
import { Employee } from '../employees/models/employees.entity';
import { Product } from '../products/models/product.entity'
import { Cash } from '../financial/models/cash.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'), 
        entities: [User, Client, Employee, Product, Cash],
        synchronize: true
      }),
    }),
  ],
})

export class DatabaseModule {}