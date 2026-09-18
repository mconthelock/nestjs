import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
export class CreateReportDto {
    @IsString()
    VORGNO: string;

    @IsString()
    VNAME: string;

    @IsString()
    VURL: string;

    @IsString()
    CSTATUS: string;

    @IsNumber()
    @Type(() => Number)
    NSEQ: number;
}
