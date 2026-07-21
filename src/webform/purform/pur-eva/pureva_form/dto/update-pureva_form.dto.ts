import { PartialType } from '@nestjs/swagger';
import { CreatePurevaFormDto } from './create-pureva_form.dto';

export class UpdatePurevaFormDto extends PartialType(CreatePurevaFormDto) {}
