import { PartialType } from '@nestjs/mapped-types';
import { CreatePisPagesDto } from './create-pis-pages.dto';

export class UpadatePisPagesDto extends PartialType(CreatePisPagesDto) {}
