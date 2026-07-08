import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PSDLCReportDto {
    @IsOptional()
    @IsString()
    @Type(() => String)
    DRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    OLDCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    CHANGE_SCHD?: string;
}
