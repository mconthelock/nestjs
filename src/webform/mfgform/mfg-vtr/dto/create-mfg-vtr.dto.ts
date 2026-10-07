import { IsNotEmpty } from 'class-validator';

export class CreateMfgVtrDto {
    @IsNotEmpty()
    INPUTBY: string;

    @IsNotEmpty()
    REQBY: string;

    @IsNotEmpty()
    REQUEST_DATE: Date;

    @IsNotEmpty()
    DETAILS: CreateMfgVtrDetailDto[];
}

export class CreateMfgVtrDetailDto {
    @IsNotEmpty()
    PRODUCT_ID: string;

    @IsNotEmpty()
    QTY: number;
}
