import { PartialType } from '@nestjs/swagger';
import { CreateStinpFormDto } from './create-stinp-form.dto';

export class UpdateStinpFormDto extends PartialType(CreateStinpFormDto) {}
