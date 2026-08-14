import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';

import { CreateOvertimeDto } from './create-overtime.dto';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class FormDto extends PartialType(CreateFormDto) {}

export class SearchOvertimeDto extends PartialType(CreateOvertimeDto) {
    @IsOptional()
    @ValidateNested()
    @Type(() => FormDto)
    FORM?: FormDto;
}
