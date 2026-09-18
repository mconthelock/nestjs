import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { CreateJigDto } from './create-jig.dto';
import { CreateJigFormDto } from './jig-form.dto';

export class CreateJigRequestDto extends IntersectionType(
    CreateJigFormDto,
    PickType(CreateJigDto, ['JIG_NO'] as const),
) {}
