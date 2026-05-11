import { PartialType } from '@nestjs/swagger';
import { CreateFormAttachmentTypeDto } from './create-form-attachment-type.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFormAttachmentTypeDto extends PartialType(
    CreateFormAttachmentTypeDto,
) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NID: number;
}

export class SearchFormAttachmentTypeDto extends PartialType(
    CreateFormAttachmentTypeDto,
) {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NID?: number;
}
