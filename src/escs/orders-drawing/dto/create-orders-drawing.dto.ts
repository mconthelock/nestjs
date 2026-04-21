import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrdersDrawingDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    ORD_PRODUCTION: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    ORD_NO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    ORD_ITEM: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ORDDW_ID: number;
}
