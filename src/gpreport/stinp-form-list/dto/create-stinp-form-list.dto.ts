import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PrimaryKeyStinpFormListDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VORGNO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NID: number;
}

export class CreateStinpFormListDto extends PickType(
    PrimaryKeyStinpFormListDto,
    ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO', 'NID'],
) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NITEM: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VAREA: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VDETECTED: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NIMAGE: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NCLASS: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VSUGGESTION: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NMAT: number;
}
