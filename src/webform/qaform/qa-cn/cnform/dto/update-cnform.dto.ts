import { PartialType } from '@nestjs/swagger';
import { CreateCnformDto } from './create-cnform.dto';

export class UpdateCnformDto extends PartialType(CreateCnformDto) {}
