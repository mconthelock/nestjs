import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { FireCheckDetailKeyDto } from './fire-check-key.dto';
import { SearchFireItemDto } from './search-fire-item.dto';

export class SearchFireCheckDetailDto extends IntersectionType(
    PartialType(FireCheckDetailKeyDto, { skipNullProperties: false }),
    PickType(SearchFireItemDto, ['page', 'limit'] as const),
) {}
