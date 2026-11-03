import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFireItemDto } from './create-fire-item.dto';

export class UpdateFireItemDto extends PartialType(
    OmitType(CreateFireItemDto, ['FIRE_CODE'] as const),
) {}

