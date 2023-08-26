import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class TelegramCallbackQueryDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  photo_url: string;

  /**
   * Need multiply to 1000 and can be parsed via Date
   * example: new Date(auth_date * 1000) = UTC time
   */
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  auth_date: number;

  @IsString()
  hash: string;
}
