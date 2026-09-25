import { PartialType } from '@nestjs/swagger';
import { CreateGpUnfDto } from './create-gp-unf.dto';

export class UpdateGpUnfDto extends PartialType(CreateGpUnfDto) {}
