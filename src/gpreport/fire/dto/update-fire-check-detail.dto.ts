import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFireCheckDetailDto } from './create-fire-check-detail.dto';

export class UpdateFireCheckDetailDto extends PartialType(
    OmitType(CreateFireCheckDetailDto, ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO', 'ID', 'FIRE_CODE'] as const),
) {}
