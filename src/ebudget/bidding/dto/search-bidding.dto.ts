import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class SearchEbudgetBiddingDto {
    @IsNotEmpty()
    @IsString()
    VREQNO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2: string;
}
