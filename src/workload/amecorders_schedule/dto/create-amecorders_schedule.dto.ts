import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateAmecOrdersScheduleDto {
    @IsString()
    REFMFGNO: string;

    @IsString()
    DESBM: string;

    @IsDate()
    @Type(() => Date)
    DESBM_PLAN: Date;

    @IsDate()
    @Type(() => Date)
    DESBM_ACTUAL: Date;

    @IsNumber()
    @Type(() => Number)
    MFGBM_NO: number;

    @IsString()
    MFGBM: string;

    @IsString()
    MFGBM_P: string;

    @IsDate()
    @Type(() => Date)
    MFGBM_PLAN: Date;

    @IsDate()
    @Type(() => Date)
    MFGBM_ACTUAL: Date;

    @IsDate()
    @Type(() => Date)
    FEEDER1_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    FEEDER1_FINDATE: Date;

    @IsNumber()
    FEEDER1_TOTAL: number;

    @IsNumber()
    FEEDER1_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    FEEDER2_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    FEEDER2_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    FEEDER2_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    FEEDER2_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    SUBASSY_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    SUBASSY_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    SUBASSY_TOTAL: number;

    @IsNumber()
    SUBASSY_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    ASSY_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    ASSY_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    ASSY_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    ASSY_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    INSPECTION_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    INSPECTION_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    INSPECTION_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    INSPECTION_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    PACKING_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    PACKING_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    PACKING_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    PACKING_ACTUAL: number;

    @IsNumber()
    @Type(() => Number)
    SUBCON_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    SUBCON_ACTUAL: number;

    @IsDate()
    @Type(() => Date)
    SUBCON_FINDATE: Date;

    @IsDate()
    @Type(() => Date)
    VANNING_PLANDATE: Date;

    @IsDate()
    @Type(() => Date)
    VANNING_FINDATE: Date;

    @IsNumber()
    @Type(() => Number)
    VANNING_TOTAL: number;

    @IsNumber()
    @Type(() => Number)
    VANNING_ACTUAL: number;

    @IsString()
    JOPORDER: string;

    @IsNumber()
    @Type(() => Number)
    ORDSTATUS: number;

    @IsDate()
    @Type(() => Date)
    MFG_FINISDATE: Date;

    @IsDate()
    @Type(() => Date)
    LAST_UPDATE: Date;

    @IsDate()
    @Type(() => Date)
    SHIPMENT_DATE: Date;
}
