import { IsNotEmpty } from 'class-validator';

export class CreateMfgVtrDto {
    @IsNotEmpty()
    REQBY: string;

    @IsNotEmpty()
    DETAILS: CreateMfgVtrDetailDto[];
}

export class CreateMfgVtrDetailDto {
    @IsNotEmpty()
    PRODUCT_ID: string;

    @IsNotEmpty()
    QTY: number;
}
