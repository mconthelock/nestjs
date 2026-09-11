import { PartialType } from '@nestjs/swagger';
import { CreatePilineBendingAttDto } from './create-piline_bending_att.dto';

export class UpdatePilineBendingAttDto extends PartialType(CreatePilineBendingAttDto) {}
