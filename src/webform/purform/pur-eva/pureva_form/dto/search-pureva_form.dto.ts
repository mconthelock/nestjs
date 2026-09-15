import { CreatePurevaFormDto } from 'src/webform/purform/pur-eva/pureva_form/dto/create-pureva_form.dto';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateFlowDto } from 'src/webform/flow/dto/create-flow.dto';
import { searchDto } from 'src/amec/users/dto/search-user.dto';
import { StringToDate } from 'src/common/utils/transform';

export class searchFormDto extends PartialType(CreateFormDto) {
    @StringToDate()
    @IsDate()
    START_DREQDATE: Date;

    @StringToDate()
    @IsDate()
    @Type(() => Date)
    END_DREQDATE: Date;

    @ValidateNested()
    @Type(() => PartialType(CreateFlowDto))
    flow: CreateFlowDto;

    @ValidateNested()
    @Type(() => PartialType(searchDto))
    reqtor: searchDto;

    @IsString()
    CST: string;
}

export class SearchPurevaFormDto extends PartialType(CreatePurevaFormDto) {
    @ValidateNested()
    @IsOptional()
    @Type(() => PartialType(searchFormDto))
    evaform: searchFormDto;
}
