import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateJigDto {
    @IsString()
    @IsNotEmpty()
    JIG_NO: string;

    @IsString()
    @IsNotEmpty()
    JIG_NAME: string;

    @IsOptional()
    @IsString()
    DRAWING_NO?: string;

    @IsOptional()
    @IsNumber()
    JIG_QTY?: number;

    @IsOptional()
    @IsNumber()
    PRICE?: number;

    @IsOptional()
    @IsString()
    MAKER?: string;

    @IsOptional()
    @IsDateString()
    START_USE_DATE?: string;

    @IsOptional()
    @IsString()
    ITEMNO?: string;

    @IsOptional()
    @IsString()
    PARTS?: string;

    @IsOptional()
    @IsString()
    PROCESS_CODE?: string;

    @IsOptional()
    @IsString()
    PIC_EMPNO?: string;

    @IsNumber()
    @Min(1)
    INSPEC_PERIOD: number;

    @IsDateString()
    NEXT_INSPEC_DATE: string;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsString()
    CREATE_BY?: string;
}