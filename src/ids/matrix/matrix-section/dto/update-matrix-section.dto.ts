import { PartialType } from '@nestjs/swagger';
import { CreateMatrixSectionDto } from './create-matrix-section.dto';

export class UpdateMatrixSectionDto extends PartialType(CreateMatrixSectionDto) {}
