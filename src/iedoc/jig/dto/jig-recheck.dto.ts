import { Type } from 'class-transformer';
import { IsArray, ArrayUnique, IsDateString, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { JigFileDto } from './jig-form.dto';

export class SaveJigRecheckDto {
    @IsString() @IsNotEmpty() @MaxLength(10)
    UPDATE_BY: string;
    @IsDateString({ strict: true }) @IsNotEmpty()
    ACTUAL_FINNISH_DATE: string;
    @IsString() @IsNotEmpty() @MaxLength(2000)
    SUMMARY_DETAIL: string;
    @IsArray() @ArrayUnique((file) => file.FILE_SEQ)
    @ValidateNested({ each: true }) @Type(() => JigFileDto)
    FILES: JigFileDto[];
}
