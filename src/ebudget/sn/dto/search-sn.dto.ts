import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class SearchEbudgetSnDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    FYEAR: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VORGCODE?: string;

    @IsOptional()
    @Type(() => FormDto)
    @ValidateNested()
    FORM?: FormDto;
}
