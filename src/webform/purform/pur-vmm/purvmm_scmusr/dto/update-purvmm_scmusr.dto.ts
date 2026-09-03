import { PartialType } from '@nestjs/swagger';
import { CreatePurVmmScmusrDto } from './create-purvmm_scmusr.dto';

export class UpdatePurvmmScmusrDto extends PartialType(CreatePurVmmScmusrDto) {}
