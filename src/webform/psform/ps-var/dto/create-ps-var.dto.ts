import { IsNumber, IsString } from 'class-validator';

export class CreatePsVarDto {
    @IsString()
    REQBY: string;

    @IsString()
    INPUTBY: string;

    @IsNumber()
    REPORT_ID: number;
}
