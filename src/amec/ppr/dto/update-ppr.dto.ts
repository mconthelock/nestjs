import { PartialType } from '@nestjs/swagger';
import { CreatePprDto } from './create-ppr.dto';

export class UpdatePprDto extends PartialType(CreatePprDto) {}
