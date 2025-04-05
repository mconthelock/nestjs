import { PartialType } from '@nestjs/mapped-types';
import { CreatePsectionDto } from './create-psection.dto';

export class UpdatePsectionDto extends PartialType(CreatePsectionDto) {}
