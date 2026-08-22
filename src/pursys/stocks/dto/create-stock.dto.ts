import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    Min,
} from 'class-validator';

export class CreateStockDto {
    @IsNotEmpty()
    @IsNumber()
    warehouseId: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    lotId: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number;

    @IsOptional()
    remark?: string;
}
