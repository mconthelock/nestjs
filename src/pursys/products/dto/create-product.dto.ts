import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty({ message: 'SKU ห้ามเป็นค่าว่าง' })
    SKU: string;

    @IsString()
    @IsNotEmpty({ message: 'ชื่อสินค้าห้ามเป็นค่าว่าง' })
    NAME: string;

    @IsString()
    @IsOptional()
    DESCRIPTION?: string;

    @IsNumber()
    CATEGORY_ID: number;

    @IsOptional()
    EXTRA_ATTRIBUTES?: Record<string, any>;
}
