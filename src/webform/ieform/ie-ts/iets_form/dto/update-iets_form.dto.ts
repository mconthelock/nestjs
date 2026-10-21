import { PartialType } from '@nestjs/swagger';
import { CreateIetsFormDto } from './create-iets_form.dto';

export class UpdateIetsFormDto extends PartialType(CreateIetsFormDto) {}
