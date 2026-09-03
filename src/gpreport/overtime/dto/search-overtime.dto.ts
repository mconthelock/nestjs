import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';

import { CreateOvertimeDto } from './create-overtime.dto';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { searchDto } from 'src/amec/users/dto/search-user.dto';

export class FormDto extends PartialType(CreateFormDto) {}
export class UsersDto extends PartialType(searchDto) {}

export class SearchOvertimeDto extends PartialType(CreateOvertimeDto) {
    @IsOptional()
    @ValidateNested()
    @Type(() => FormDto)
    FORM?: FormDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => UsersDto)
    user?: UsersDto;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    START_WORKDATE?: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    END_WORKDATE?: Date;
}
