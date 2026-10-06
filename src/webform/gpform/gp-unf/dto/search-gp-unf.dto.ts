import { PartialType } from '@nestjs/swagger';
import { CreateGpUnfDto } from './create-gp-unf.dto';

export class SearchGpUnfDto extends PartialType(CreateGpUnfDto) {}
