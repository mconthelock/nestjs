import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { StringToDate } from 'src/common/utils/transform';

export class SearchReportDto {
    @IsOptional()
    @IsString()
    CST?: string;

    @IsOptional()
    @IsString()
    VREQNO?: string;

    @IsOptional()
    @StringToDate()
    @IsDate()
    DREQDATE?: Date;
}
