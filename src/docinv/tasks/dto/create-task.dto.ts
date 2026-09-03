import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    TASK_DETAIL: string;

    @IsString()
    TASK_STATUS: string;

    @IsString()
    TASK_PRIORITY: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    TASK_DUE_DATE: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    TASK_COMPLETION_DATE: Date;

    @IsString()
    TASK_OWNER: string;
}
