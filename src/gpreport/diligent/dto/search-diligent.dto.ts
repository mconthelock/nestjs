import { PartialType } from '@nestjs/swagger';
import { CreateDiligentDto } from './create-diligent.dto';

export class SearchDiligentDto extends PartialType(CreateDiligentDto) {}
