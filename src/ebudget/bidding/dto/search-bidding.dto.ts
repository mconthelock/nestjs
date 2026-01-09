import { IsNotEmpty, IsString } from "class-validator";

export class SearchEbudgetBiddingDto {
    @IsNotEmpty()
    @IsString()
    VREQNO: string;

    @IsNotEmpty()
    @IsString()
    CYEAR2: string;
}
