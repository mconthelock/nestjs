import { IsOptional, IsString } from 'class-validator';

export class searchDpmsPackingListDto {
    @IsOptional()
    @IsString()
    TYPE?: string;

    @IsOptional()
    @IsString()
    PROD?: string;

    @IsOptional()
    @IsString()
    P?: string;

    @IsOptional()
    @IsString()
    ORDERS?: string;

    @IsOptional()
    @IsString()
    SERIES?: string;

    @IsOptional()
    @IsString()
    MODEL_SPEC?: string;

    @IsOptional()
    @IsString()
    PROJECT?: string;

    @IsOptional()
    @IsString()
    COMBINE?: string;

    @IsOptional()
    @IsString()
    REQUEST_PARTIAL?: string;

    @IsOptional()
    @IsString()
    DFINISHALL?: string;

    @IsOptional()
    @IsString()
    WEIGHT?: string;

    @IsOptional()
    @IsString()
    PL_PLAN?: string;

    @IsOptional()
    @IsString()
    FINISH_DATE?: string;
}
