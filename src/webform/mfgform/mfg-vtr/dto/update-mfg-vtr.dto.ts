import { PartialType } from '@nestjs/swagger';
import { CreateMfgVtrDto } from './create-mfg-vtr.dto';

export class UpdateMfgVtrDto extends PartialType(CreateMfgVtrDto) {}
