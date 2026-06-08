import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
export class CreateIsJdrDto {
    @IsString()
    RC_SECTION: string;

    @IsString()
    RC_DATETIME: Date;

    @IsString()
    RC_JOBNO: string;

    @IsNumber()
    @Type(() => Number)
    RC_ACTION: number;

    @IsNumber()
    @Type(() => Number)
    RC_CONCERN: number;

    @IsString()
    RC_CHECKER: string;

    @IsString()
    RC_CHECKDATE: Date;
}
