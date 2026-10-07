import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { SearchAmecOrdersScheduleDto } from '../../amecorders_schedule/dto/search-schedule.dto';

export class SearchAmecOrdersDto {
    @IsOptional()
    @IsString()
    MFGNO: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SearchAmecOrdersScheduleDto)
    schedule: SearchAmecOrdersScheduleDto;
}

export class SearchPackingDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => SearchAmecOrdersDto)
    detail: SearchAmecOrdersDto;
}
