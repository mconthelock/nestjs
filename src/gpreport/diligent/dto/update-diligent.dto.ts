import { PartialType } from '@nestjs/swagger';
import { CreateDiligentDto } from './create-diligent.dto';

export class UpdateDiligentDto extends PartialType(CreateDiligentDto) {}
