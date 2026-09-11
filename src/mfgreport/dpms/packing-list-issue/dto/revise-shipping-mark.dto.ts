import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { ToBoolean } from "src/common/utils/transform";
import { CreateDpmsPlOriginDto } from "src/workload/dpms_pl_origin/dto/create-dpms_pl_origin.dto";

export class ReviseShippingMarkDto {
    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    IS_REVISE: boolean;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    POID?: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateDpmsPlOriginDto)
    DATA: CreateDpmsPlOriginDto;
}