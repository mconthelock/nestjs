import { PartialType } from '@nestjs/swagger';
import { CreateAvmDto } from './create-avm.dto';

export class UpdateAvmDto extends PartialType(CreateAvmDto) {}
