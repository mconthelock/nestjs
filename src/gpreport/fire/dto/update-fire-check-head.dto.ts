import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateFireCheckHeadDto } from './create-fire-check-head.dto';

export class UpdateFireCheckHeadDto extends PartialType(
    PickType(CreateFireCheckHeadDto, ['AREA', 'FMONTH', 'FYEAR'] as const),
    { skipNullProperties: false },
) {}
