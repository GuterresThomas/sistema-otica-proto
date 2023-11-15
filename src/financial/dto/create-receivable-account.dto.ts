import { IsUUID, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CreateReceivableAccountDto {
  @IsNumber()
  amount_in_cents: number;

  @IsDate()
  due_date: Date;

  @IsBoolean()
  is_open: boolean;

  @IsBoolean()
  received: boolean;

  @IsUUID()
  user_id: string; 
  
  @IsUUID()
  cash_id: string; 
}
