import { PartialType } from '@nestjs/swagger';
import { CreateBlockPackingDto } from './create-block_packing.dto';

export class UpdateBlockPackingDto extends PartialType(CreateBlockPackingDto) {}
