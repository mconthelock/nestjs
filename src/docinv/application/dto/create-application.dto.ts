import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';
export class CreateApplicationDto {
  //   @Type(() => Number)
  //   @IsNumber()
  //   APP_ID?: number;

  @IsString()
  @IsOptional()
  APP_NAME?: string;

  @IsString()
  @IsOptional()
  APP_LOCATION?: string;

  @IsString()
  @IsOptional()
  APP_PIC1?: string;

  @IsString()
  @IsOptional()
  APP_PIC2?: string;

  @IsString()
  @IsOptional()
  APP_ITGC?: string;

  @IsString()
  @IsOptional()
  APP_CODE?: string;

  @IsString()
  @IsOptional()
  APP_DESCRIPTION?: string;

  @IsString()
  @IsOptional()
  APP_STATUS?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  APP_UPDATE?: string;

  @IsString()
  @IsOptional()
  APP_UPDATEBY?: string;

  @IsString()
  @IsOptional()
  APP_REVISION?: string;

  @IsString()
  @IsOptional()
  APP_SERVER?: string;

  @IsString()
  @IsOptional()
  APP_TYPE?: string;

  @IsString()
  @IsOptional()
  APP_RLS1?: string;

  @IsString()
  @IsOptional()
  APP_RLS2?: string;

  @IsString()
  @IsOptional()
  APP_DIV?: string;

  @IsString()
  @IsOptional()
  APP_NO?: string;

  @IsString()
  @IsOptional()
  APP_LOGIN?: string;

  @IsString()
  @IsOptional()
  APP_COLOR?: string;

  @IsString()
  @IsOptional()
  APP_ICON?: string;

  @IsString()
  @IsOptional()
  APP_LABEL?: string;

  @IsString()
  @IsOptional()
  APP_POSTER?: string;

  @IsString()
  @IsOptional()
  APP_LICENSE?: string;

  @IsString()
  @IsOptional()
  APP_LICENSE_LINK?: string;
}
