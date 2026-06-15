import { PartialType } from '@nestjs/swagger';
import { CreateVorgmstDto } from './create-vorgmst.dto';

export class UpdateVorgmstDto extends PartialType(CreateVorgmstDto) {}
