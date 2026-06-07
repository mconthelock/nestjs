import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';
export class CreateIsOffDto {
    @IsDate()
    @Type(() => Date)
    OFF_DATE: Date;

    @IsString()
    OFF_DISPLAYNAME: string;

    @IsString()
    OFF_EMPNO: string;

    @IsString()
    OFF_USERNAME: string;

    @IsNumber()
    @Type(() => Number)
    OFF_REASON: number;

    @IsNumber()
    @Type(() => Number)
    OFF_REASON_TYPE: number;

    @IsString()
    OFF_USERCODE: string;

    @IsString()
    OFF_CONTROLLER: string;

    @IsString()
    OFF_STATUS: string;

    @IsDate()
    @Type(() => Date)
    OFF_CREATEDATE?: Date;
}
