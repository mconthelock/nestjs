import { IsDate, IsOptional, IsString } from 'class-validator';

export class SearchReportDto {
    @IsOptional()
    @IsString()
    CST?: string;

    @IsOptional()
    @IsString()
    VREQNO?: string;

    @IsOptional()
    @IsDate()
    DREQDATE?: Date;
}
