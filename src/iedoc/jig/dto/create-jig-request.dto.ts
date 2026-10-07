import { IntersectionType, PickType, PartialType } from '@nestjs/mapped-types';
import { CreateJigDto } from './create-jig.dto';
import { CreateJigFormDto } from './jig-form.dto';

export class CreateJigRequestDto extends IntersectionType(
    CreateJigFormDto,
    PartialType(PickType(CreateJigDto, ['JIG_NO'] as const)),
) {}
