import { PartialType } from '@nestjs/swagger';
import { CreateBlockmasterDto } from './create-blockmaster.dto';

export class UpdateBlockmasterDto extends PartialType(CreateBlockmasterDto) {}
