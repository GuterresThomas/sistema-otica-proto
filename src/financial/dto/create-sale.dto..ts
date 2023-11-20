import { IsUUID, IsNumber, IsDate } from 'class-validator';

export class CreateSaleDto {
  @IsUUID()
  client_id: string;

  @IsUUID()
  product_id: string;

  @IsUUID()
  user_id: string;

  @IsNumber()
  quantity_sold: number;

  @IsDate()
  sale_date: Date;

  @IsNumber()
  total_amount_in_cents: number;
  
  @IsUUID()
  cash_id: string;
}