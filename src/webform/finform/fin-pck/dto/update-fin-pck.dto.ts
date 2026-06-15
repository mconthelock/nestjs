import { PartialType } from '@nestjs/swagger';
import { CreateFinPckDto } from './create-fin-pck.dto';

export class UpdateFinPckDto extends PartialType(CreateFinPckDto) {}
