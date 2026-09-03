import { PartialType } from '@nestjs/swagger';
import { CreateGpTphDto } from './create-gp-tph.dto';

export class UpdateGpTphDto extends PartialType(CreateGpTphDto) {}
