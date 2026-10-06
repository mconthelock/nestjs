import { PartialType } from '@nestjs/swagger';
import { CreateRnfrmPartDto } from './create-rnfrm_part.dto';

export class UpdateRnfrmPartDto extends PartialType(CreateRnfrmPartDto) {}
