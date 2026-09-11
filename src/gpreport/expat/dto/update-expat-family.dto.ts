import { PartialType } from '@nestjs/mapped-types';
import { CreateExpatFamilyDto } from './create-expat-family.dto';

export class UpdateExpatFamilyDto extends PartialType(
    CreateExpatFamilyDto,
) {}