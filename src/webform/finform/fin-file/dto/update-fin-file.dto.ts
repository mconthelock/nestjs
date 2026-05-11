import { PartialType } from '@nestjs/swagger';
import { CreateFinFileDto } from './create-fin-file.dto';

export class UpdateFinFileDto extends PartialType(CreateFinFileDto) {}
