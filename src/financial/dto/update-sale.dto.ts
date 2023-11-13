import { IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  @IsNumber()
  quantity_sold?: number;

  @IsOptional()
  @IsDate()
  sale_date?: Date;

  @IsOptional()
  @IsNumber()
  total_amount_in_cents?: number;
}