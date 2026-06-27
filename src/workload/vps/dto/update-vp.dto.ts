import { PartialType } from '@nestjs/swagger';
import { CreateVpDto } from './create-vp.dto';

export class UpdateVpDto extends PartialType(CreateVpDto) {}
