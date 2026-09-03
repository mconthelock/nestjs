import { IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRnlistDto {
    @IsInt()
    NFRMNO: number;

    @IsString()
    @MaxLength(6)
    VORGNO: string;

    @IsString()
    @MaxLength(2)
    CYEAR: string;

    @IsString()
    @MaxLength(4)
    CYEAR2: string;

    @IsInt()
    NRUNNO: number;

    @IsInt()
    ID: number;

    @IsOptional()
    @IsString()
    @MaxLength(9)
    ORDERNO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(17)
    DWGNO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    PROJNO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    PROD?: string;

    @IsOptional()
    @IsString()
    @MaxLength(4)
    ITEM?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    PART?: string;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    MODEL?: string;

    @IsOptional()
    @IsInt()
    QTY?: number;

    @IsOptional()
    @IsNumber()
    LOSS?: number;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    REFNO?: string;
}