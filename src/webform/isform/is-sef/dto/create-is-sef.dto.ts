import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreateIsSefDto {
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

    @IsObject()
    SCORE: Record<string, number>;

    @IsNumber()
    PRO_AVG: number;

    @IsNumber()
    APP_AVG: number;

    @IsNumber()
    OVERALL_AVG: number;

    @IsNumber()
    LEVEL: number;

    @IsString()
    COMMENT: string;
}

// export class CreateIsSefDto extends PickType(FormDto, ['NFRMNO', 'VORGNO', 'CYEAR'] as const) {

//     PROJECT_ID?: string;

//     SCORE: Record<string, number>;

//     PRO_AVG: number;
//     APP_AVG: number;
//     OVERALL_AVG: number;

//     LEVEL: number;
//     COMMENT: string;
// }
