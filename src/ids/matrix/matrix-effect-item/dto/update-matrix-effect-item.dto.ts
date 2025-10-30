import { PartialType } from '@nestjs/swagger';
import { CreateMatrixEffectItemDto } from './create-matrix-effect-item.dto';

export class UpdateMatrixEffectItemDto extends PartialType(CreateMatrixEffectItemDto) {}
