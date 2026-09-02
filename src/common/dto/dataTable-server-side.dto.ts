import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ToBoolean } from "../utils/transform";

class DataTableOrderingDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    column: number;

    @IsNotEmpty()
    @IsEnum(['asc', 'desc'])
    @Type(() => String)
    dir: 'asc' | 'desc';

    @IsNotEmpty()
    @IsString() 
    @Type(() => String)
    name: string;
}

class DataTableSearchDto {
    @IsOptional()
    @IsString()
    @Type(() => String)
    value?: string;

    @IsOptional()
    @ToBoolean()
    regex?: boolean;
}

class DataTableColumnDto {
    @IsOptional()
    @IsString()
    @Type(() => String)
    data?: string | null;

    @IsOptional()
    @IsString()
    @Type(() => String)
    name?: string;

    @IsNotEmpty()
    @ToBoolean()
    searchable: boolean;

    @IsNotEmpty()
    @ToBoolean()
    orderable: boolean;

    @IsNotEmpty()
    @Type(() => DataTableSearchDto)
    @ValidateNested()
    search: DataTableSearchDto;
}

export class DataTableServerSideDto {
    // draw: number;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    start: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    length: number;

    @IsNotEmpty()
    @Type(() => DataTableSearchDto)
    @ValidateNested()
    search: DataTableSearchDto;

    @IsNotEmpty()
    @Type(() => DataTableOrderingDto)
    @ValidateNested({ each: true })
    order: DataTableOrderingDto[];

    @IsNotEmpty()
    @Type(() => DataTableColumnDto)
    @ValidateNested({ each: true })
    columns: DataTableColumnDto[];
}