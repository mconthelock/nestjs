import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
    IsOptional,
    IsString,
    MaxLength,
    IsIn,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JigFormKeyDto } from './jig-form.dto';
import { CreateJigDto } from './create-jig.dto';
export class UpdateJigDto extends PartialType(
    OmitType(CreateJigDto, ['JIG_NO', 'CREATE_BY'] as const),
    { skipNullProperties: false },
) {
    @IsOptional()
    @ValidateNested()
    @Type(() => JigFormKeyDto)
    FORM_KEY?: JigFormKeyDto;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    UPDATE_BY?: string;
    @IsOptional()
    @IsIn([
        'DRAFT',
        'PENDING',
        'ACTIVE',
        'INACTIVE',
        'PENDING_DELETE',
        'DELETED',
        'TRANSFERRED',
    ])
    JIG_STATUS?: string;
}
