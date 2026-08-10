import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class AddToolItemDto {
    @IsNotEmpty()
    SPRODID: string;
}

export class AddToolsVendingDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddToolItemDto)
    ITEMS?: AddToolItemDto[];

    @IsNotEmpty()
    EMPNO: string;
}
