import { PartialType } from '@nestjs/swagger';
import { CreateRnlistDto } from './create-rnlist.dto';

export class UpdateRnlistDto extends PartialType(CreateRnlistDto) {}
