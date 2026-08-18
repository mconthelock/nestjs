import { PartialType } from '@nestjs/swagger';
import { CreateRnlistPpDto } from './create-rnlist_pp.dto';

export class UpdateRnlistPpDto extends PartialType(CreateRnlistPpDto) {}
