import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JigFormKeyDto, SaveJigFormDto } from './jig-form.dto';
export class UpdateJigDto extends SaveJigFormDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => JigFormKeyDto)
    FORM_KEY: JigFormKeyDto;
}
