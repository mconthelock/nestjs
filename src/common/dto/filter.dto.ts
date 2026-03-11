import { Type } from 'class-transformer';
import {
    IsArray,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class FiltersDto {
    // format เดิม
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilterNodeDto)
    filters?: FilterNodeDto[];

    // format ใหม่
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilterNodeDto)
    AND?: FilterNodeDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilterNodeDto)
    OR?: FilterNodeDto[];
}

export class FilterNodeDto {
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FilterNodeDto)
    AND?: FilterNodeDto[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => FilterNodeDto)
    OR?: FilterNodeDto[];

    @IsOptional()
    @IsString()
    field?: string;

    @IsOptional()
    @IsIn([
        'eq',
        'ne',
        'gt',
        'gte',
        'lt',
        'lte',
        'like',
        'startsWith',
        'endsWith',
        'in',
        'notIn',
        'isNull',
        'isNotNull',
    ])
    op?: string;

    @IsOptional()
    value?: any;

    @IsOptional()
    type?: any;
}
