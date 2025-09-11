import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DataESCSARMDto } from './data-audit_report_master.dto';
export class SaveESCSARMDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  secid: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  incharge: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataESCSARMDto)
  list: DataESCSARMDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataESCSARMDto)
  topic: DataESCSARMDto[];
}
