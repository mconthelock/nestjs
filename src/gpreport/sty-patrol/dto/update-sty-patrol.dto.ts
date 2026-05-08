import { PartialType, PickType } from '@nestjs/swagger';
import { CreateStyPatrolDto } from './create-sty-patrol.dto';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { StringToDate } from 'src/common/utils/transform';

export class UpdateStyPatrolDto extends PickType(CreateStyPatrolDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'PA_ID',
]) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_EMP_CORRECTIVE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PA_CORRECTIVE?: string;

    @IsOptional()
    @StringToDate()
    @IsDate()
    PA_FINISH_DATE?: Date;

    @IsOptional()
    @StringToDate()
    @IsDate()
    PA_MORNING_TALK?: Date;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PA_AUDIT_EVALUATE?: number;
}
