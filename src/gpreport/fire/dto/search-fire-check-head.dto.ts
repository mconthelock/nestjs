import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateFireCheckHeadDto } from './create-fire-check-head.dto';
import { SearchFireItemDto } from './search-fire-item.dto';

export class SearchFireCheckHeadDto extends IntersectionType(
    PartialType(CreateFireCheckHeadDto, { skipNullProperties: false }),
    PickType(SearchFireItemDto, ['page', 'limit'] as const),
) {}
