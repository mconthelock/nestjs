import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ReprintPackingOrderDto {
    @IsNotEmpty()
    @IsString()
    order: string;

    @IsNotEmpty()
    @IsString()
    packing: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    qtyPrint: number;

    @IsNotEmpty()
    @IsString()
    empno: string;
}
