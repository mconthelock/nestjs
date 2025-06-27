import { PartialType } from '@nestjs/swagger';
import { CreateIsMoDto } from './create-is-mo.dto';

export class UpdateIsMoDto extends PartialType(CreateIsMoDto) {}
