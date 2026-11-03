import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsDateString,
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';
import { JigFileDto } from './jig-form.dto';

export class JigConfirmDto {
    @IsDefined()
    @IsInt()
    @Min(1)
    @Max(999)
    CHECK_SEQ: number;

    @IsDefined()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(-99999999.9999)
    @Max(99999999.9999)
    CONFIRM_VALUE: number;
}

export class SaveJigRecheckDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    UPDATE_BY: string;

    @IsDefined()
    @IsDateString({ strict: true })
    ACTUAL_FINNISH_DATE: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    SUMMARY_DETAIL: string;

    @IsArray()
    @ArrayUnique((item) => item.FILE_SEQ)
    @ValidateNested({ each: true })
    @Type(() => JigFileDto)
    FILES: JigFileDto[];

    @IsArray()
    @ArrayUnique((item) => item.CHECK_SEQ)
    @ValidateNested({ each: true })
    @Type(() => JigConfirmDto)
    CONFIRMS: JigConfirmDto[];
}
