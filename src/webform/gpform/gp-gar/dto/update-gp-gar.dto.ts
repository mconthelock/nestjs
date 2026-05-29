import { PartialType } from '@nestjs/swagger';
import { CreateGpGarDto } from './create-gp-gar.dto';

export class UpdateGpGarDto extends PartialType(CreateGpGarDto) {}
