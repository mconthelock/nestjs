import { PartialType } from '@nestjs/swagger';
import { CreatePappstepDto } from './create-pappstep.dto';

export class UpdatePappstepDto extends PartialType(CreatePappstepDto) {}
