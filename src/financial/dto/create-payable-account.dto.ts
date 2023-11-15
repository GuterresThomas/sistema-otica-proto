import { IsUUID, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';

export class CreatePayableAccountDto {
  @IsNumber()
  amount_in_cents: number;

  @IsOptional()
  @IsDate()
  due_date: Date;

  @IsBoolean()
  is_open: boolean;

  @IsBoolean()
  paid: boolean;

  @IsUUID()
  user_id: string; // Adapte conforme necessário para refletir a relação com a entidade User
  
  @IsUUID()
  cash_id: string; // Adapte conforme necessário para refletir a relação com a entidade User
}
