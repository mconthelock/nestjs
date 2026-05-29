import { PartialType } from '@nestjs/swagger';
import { CreatePurnvfFormDto } from './create-purnvf_form.dto';

export class UpdatePurnvfFormDto extends PartialType(CreatePurnvfFormDto) {}
