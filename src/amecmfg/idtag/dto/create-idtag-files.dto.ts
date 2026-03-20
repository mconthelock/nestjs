import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIdtagFilesDto {
    @Type(() => Date)
    @IsDate()
    SCHDDATE: Date;

    @IsString()
    SCHDNUMBER: string;

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

    @IsString()
    FILE_STATUS: string;

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
}
