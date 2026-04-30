import { PartialType } from '@nestjs/swagger';
import { CreateItemmasterDto } from './create-itemmaster.dto';

export class SearchItemmasterDto extends PartialType(CreateItemmasterDto) {}
