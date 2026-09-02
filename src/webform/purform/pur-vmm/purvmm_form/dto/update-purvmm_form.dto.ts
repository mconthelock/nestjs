import { PartialType } from '@nestjs/swagger';
import { CreatePurvmmFormDto } from './create-purvmm_form.dto';

export class UpdatePurvmmFormDto extends PartialType(CreatePurvmmFormDto) {}
