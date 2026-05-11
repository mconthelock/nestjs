import { PartialType } from '@nestjs/swagger';
import { CreateMfgFileDto } from './create-mfg-file.dto';

export class UpdateMfgFileDto extends PartialType(CreateMfgFileDto) {}
