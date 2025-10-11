import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { updateInqGroupDto } from './update.dto';
import { searchGroupDto } from './search.dto';

export class inqGroupDataDto {
  @ValidateNested()
  @Type(() => updateInqGroupDto)
  data?: updateInqGroupDto;

  @IsOptional()
  condition?: searchGroupDto;
}
