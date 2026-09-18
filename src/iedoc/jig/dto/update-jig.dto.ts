import {
    IsDefined,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JigFormKeyDto } from './jig-form.dto';
import { PatchJigSnapshotDto } from './jig-snapshot.dto';
export class UpdateJigDto extends PatchJigSnapshotDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => JigFormKeyDto)
    FORM_KEY: JigFormKeyDto;
    @IsOptional()
    @IsString()
    @MaxLength(10)
    UPDATE_BY?: string;
}
