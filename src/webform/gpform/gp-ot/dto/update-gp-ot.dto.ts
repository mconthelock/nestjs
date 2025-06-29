import { PartialType } from '@nestjs/swagger';
import { CreateGpOtDto } from './create-gp-ot.dto';

export class UpdateGpOtDto extends PartialType(CreateGpOtDto) {}
