import { PartialType } from '@nestjs/swagger';
import { CreateFinDDto } from './create-fin-d.dto';

export class UpdateFinDDto extends PartialType(CreateFinDDto) {}
