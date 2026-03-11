import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumberString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class SaveAddPassengerLineDto {
  @IsString()
  @IsNotEmpty()
  busid: string;

  @IsString()
  @IsOptional()
  busname?: string;

  @IsString()
  @IsOptional()
  @IsIn(['1', '2'])
  bustype?: string;

  @IsOptional()
  busseat?: number | null;

  @IsString()
  @IsOptional()
  line_status?: string;
}

class SaveAddPassengerStopDto {
  @IsString()
  @IsNotEmpty()
  stop_id: string;

  @IsString()
  @IsOptional()
  stop_name?: string;

  @IsString()
  @IsOptional()
  plan_time?: string;
}

class SaveAddPassengerPassengerDto {
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  empno: string;
}

export class SaveAddPassengerDto {
  @IsString()
  @IsNotEmpty()
  dispatch_id: string;

  @IsString()
  @IsNotEmpty()
  update_by: string;

  @ValidateNested()
  @Type(() => SaveAddPassengerLineDto)
  line: SaveAddPassengerLineDto;

  @ValidateNested()
  @Type(() => SaveAddPassengerStopDto)
  stop: SaveAddPassengerStopDto;

  @ValidateNested()
  @Type(() => SaveAddPassengerPassengerDto)
  passenger: SaveAddPassengerPassengerDto;
}