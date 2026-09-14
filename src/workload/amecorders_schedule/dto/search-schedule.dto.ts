import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsDate } from 'class-validator';

export class SearchAmecOrdersScheduleDto {
    @IsOptional()
    @IsString()
    DESBM: string;

    @IsOptional()
    @IsString()
    MFGBM_NO: string;

    @IsOptional()
    @IsString()
    MFGBM: string;

    @IsOptional()
    @IsString()
    MFGBM_P: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_DESBM_PLAN: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_DESBM_ACTUAL: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_MFGBM_PLAN: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_MFGBM_ACTUAL: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_FEEDER1_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_FEEDER2_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_SUBASSY_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_ASSY_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_INSPECTION_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_PACKING_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_VANNING_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_MFG_FINISDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    START_SHIPMENT_DATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_DESBM_PLAN: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_DESBM_ACTUAL: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_MFGBM_PLAN: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_MFGBM_ACTUAL: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_FEEDER1_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_FEEDER2_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_SUBASSY_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_ASSY_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_INSPECTION_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_PACKING_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_VANNING_PLANDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_MFG_FINISDATE: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    END_SHIPMENT_DATE: Date;
}
