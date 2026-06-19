import { PartialType } from '@nestjs/swagger';
import { CreatePsVarDto } from './create-ps-var.dto';

export class UpdatePsVarDto extends PartialType(CreatePsVarDto) {}
