import { PartialType } from '@nestjs/swagger';
import { CreateHbdDto } from './create-hbd.dto';

export class UpdateHbdDto extends PartialType(CreateHbdDto) {}
