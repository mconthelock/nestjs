import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate } from 'class-validator';

export class SearchActualLeaveDto {
    @IsString()
    @IsOptional()
    LR101?: string;

    @IsString()
    @IsOptional()
    LR102?: string;

    @IsString()
    @IsOptional()
    LR103?: string;

    @IsString()
    @IsOptional()
    LR104?: string;

    @IsString()
    @IsOptional()
    LR105?: string;

    @IsString()
    @IsOptional()
    LR106?: string;

    @IsString()
    @IsOptional()
    LR107?: string;

    @IsString()
    @IsOptional()
    LR108?: string;

    @IsString()
    @IsOptional()
    LR109?: string;

    @IsString()
    @IsOptional()
    LR110?: string;

    @IsString()
    @IsOptional()
    LR111?: string;

    @IsString()
    @IsOptional()
    START_LR110?: string;

    @IsString()
    @IsOptional()
    END_LR110?: string;
}
