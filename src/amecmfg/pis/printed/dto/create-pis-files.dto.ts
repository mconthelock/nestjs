import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePisFilesDto {
    @Type(() => Date)
    @IsDate()
    SCHDDATE: Date;

    @IsString()
    SCHDNUMBER: string;

    @IsString()
    SCHDCHAR: string;

    @IsString()
    SCHDP: string;

    @IsString()
    FILE_ONAME: string;

    @IsString()
    FILE_NAME: string;

    @IsString()
    FILE_FOLDER: string;

    @Type(() => Number)
    @IsNumber()
    FILE_TOTALPAGE: number;

    @Type(() => Number)
    @IsNumber()
    FILE_STATUS: number;

    @Type(() => Date)
    @IsDate()
    CREATE_DATE: Date;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    PRINTED_DATE?: Date;

    @Type(() => Number)
    @IsNumber()
    FILE_PRINTEDPAGE: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    FILES?: number;
}
