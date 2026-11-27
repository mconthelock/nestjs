import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateChemicalSectionDto } from './create-chemical-section.dto';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateChemicalSectionDto extends PartialType(
    OmitType(CreateChemicalSectionDto, ['OWNERCODE', 'AMEC_SDS_ID'] as const),
) {
    @IsNotEmpty()
    @IsString()
    OWNERCODE: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    AMEC_SDS_ID: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    STATUS?: number;

    @IsOptional()
    @IsString()
    USER_UPDATE?: string;
}
