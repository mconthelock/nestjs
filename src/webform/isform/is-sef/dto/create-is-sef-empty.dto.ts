import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateIsSefEmptyDto {
    @IsString()
    REQBY: string;

    @IsString()
    INPUTBY: string;

    @IsOptional()
    @IsString()
    REMARK?: string;

    @IsOptional()
    @IsNumber()
    PROJECT_ID?: number;

    // @IsObject()
    // SCORE: Record<string, number>;

    // @IsNumber()
    // PRO_AVG: number;

    // @IsNumber()
    // APP_AVG: number;

    // @IsNumber()
    // OVERALL_AVG: number;

    // @IsNumber()
    // LEVEL: number;

    // @IsString()
    // COMMENT: string;
}