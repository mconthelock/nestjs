import { PartialType } from '@nestjs/swagger';
import { CreateRnfrmDto } from './create-rnfrm.dto';

export class UpdateRnfrmDto extends PartialType(CreateRnfrmDto) {}
