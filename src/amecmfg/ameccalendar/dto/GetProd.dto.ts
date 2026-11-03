import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetProdDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    num: number;

    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}
