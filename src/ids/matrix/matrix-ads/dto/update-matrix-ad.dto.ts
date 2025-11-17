import { PartialType } from '@nestjs/swagger';
import { CreateMatrixAdDto } from './create-matrix-ad.dto';

export class UpdateMatrixAdDto extends PartialType(CreateMatrixAdDto) {}
