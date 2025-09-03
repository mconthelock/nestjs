import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { QueryParamsDto } from "src/common/dto/query-param.dto";

export class SearchAvmDto extends QueryParamsDto {

    @IsOptional()
    @IsString()
    VNSTAT: string;

    @IsOptional()
    @IsString()
    VMID: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    VENDOR: number;
}
