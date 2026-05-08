import { PartialType } from '@nestjs/swagger';
import { CreateStinpFormListDto } from './create-stinp-form-list.dto';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { StringToDate } from 'src/common/utils/transform';

export class UpdateStinpFormListDto extends PartialType(
    CreateStinpFormListDto,
) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    VEMP_CORRECTIVE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VCORRECTIVE?: string;

    @IsOptional()
    @StringToDate()
    @IsDate()
    DFINISH_DATE?: Date;

    @IsOptional()
    @StringToDate()
    @IsDate()
    DMORNING_TALK?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NAUDIT_EVALUATE?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NIMAGE_AFTER?: number;
}
