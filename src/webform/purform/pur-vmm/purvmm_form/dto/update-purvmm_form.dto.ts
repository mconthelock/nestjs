import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePurvmmFormDto } from './create-purvmm_form.dto';

export class UpdatePurvmmFormDto extends PartialType(
    OmitType(CreatePurvmmFormDto, [
        'NFRMNO',
        'VORGNO',
        'CYEAR',
        'CYEAR2',
        'NRUNNO',
    ] as const),
) {}
