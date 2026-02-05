import { PartialType } from '@nestjs/swagger';
import { UpdateBusstopDto } from './update-busstop.dto';

export class SearchBusstopDto extends PartialType(UpdateBusstopDto) {}
