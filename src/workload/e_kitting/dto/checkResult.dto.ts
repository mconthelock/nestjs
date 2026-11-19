import { IsString } from "class-validator";

export class CheckResultDto {
    @IsString()
    ORDERNO: string;

    @IsString()
    PACKINGNO: string;

    @IsString()
    DWG: string;

    @IsString()
    RESULT: string;

    @IsString()
    USER: string;

    @IsString()
    SEQ: string;
}
