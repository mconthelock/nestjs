import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateCategoryDto {
    @IsString()
    CATEGORY_NAME: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    PARENT_ID?: number;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    CREATED_AT?: Date;
}
