import { CreatePurvmmFormDto } from './create-purvmm_form.dto';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateFlowDto } from 'src/webform/flow/dto/create-flow.dto';
import { searchDto } from 'src/amec/users/dto/search-user.dto';
import { StringToDate } from 'src/common/utils/transform';
import { searchFormDto } from 'src/webform/purform/pur-eva/pureva_form/dto/search-pureva_form.dto';
export class SearchPurvmmFormDto extends PartialType(CreatePurvmmFormDto) {
    @ValidateNested()
    @IsOptional()
    @Type(() => PartialType(searchFormDto))
    vmmform: searchFormDto;
}
