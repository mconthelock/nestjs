import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

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
    // search: {
    //     value: string;
    //     regex: boolean;
    // };
    @IsNotEmpty()
    @Type(() => DataTableOrderingDto)
    @ValidateNested({ each: true })
    order: DataTableOrderingDto[];
    // columns: {
    //     data: string;
    //     name: string;
    //     searchable: boolean;
    //     orderable: boolean;
    //     search: {
    //         value: string;
    //         regex: boolean;
    //     };
    // }[];
}