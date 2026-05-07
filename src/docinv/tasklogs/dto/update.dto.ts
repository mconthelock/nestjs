import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class updateTasklogs {
    @IsString()
    RC_SECTION: string;

    @Type(() => Date)
    RC_DATETIME: Date;

    @IsString()
    RC_JOBNO: string;

    @Type(() => Number)
    @IsNumber()
    RC_ACTION: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    RC_CONCERN: number;

    @IsString()
    RC_CHECKER: string;

    @Type(() => Date)
    RC_CHECKDATE: Date;
}
