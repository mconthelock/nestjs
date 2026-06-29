import { PartialType } from '@nestjs/swagger';
import { CreateFinpckFormDto } from './create-finpck_form.dto';

export class UpdateFinpckFormDto extends PartialType(CreateFinpckFormDto) {}
