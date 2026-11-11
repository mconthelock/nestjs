import { IsArray, IsString } from 'class-validator';

export class AlertCmSmEmailDto {
    @IsString()
    TINO: string;

    @IsString()
    REVNO: string;

    @IsString()
    empno: string;

    @IsArray()
    @IsString({ each: true })
    to: string[];

    @IsArray()
    @IsString({ each: true })
    cc: string[];
}