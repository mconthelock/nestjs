import { PartialType } from '@nestjs/swagger';
import { CreatePurEvaDto } from './create-pur-eva.dto';

export class UpdatePurEvaDto extends PartialType(CreatePurEvaDto) {}
