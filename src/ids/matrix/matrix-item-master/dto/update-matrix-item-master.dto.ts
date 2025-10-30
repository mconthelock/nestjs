import { PartialType } from '@nestjs/swagger';
import { CreateMatrixItemMasterDto } from './create-matrix-item-master.dto';

export class UpdateMatrixItemMasterDto extends PartialType(CreateMatrixItemMasterDto) {}
