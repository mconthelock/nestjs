import { PartialType } from '@nestjs/swagger';
import { CreateIsTidDto } from './create-is-tid.dto';

export class UpdateIsTidDto extends PartialType(CreateIsTidDto) {}
