import { PartialType } from '@nestjs/swagger';
import { CreateRnsolveDto } from './create-rnsolve.dto';

export class UpdateRnsolveDto extends PartialType(CreateRnsolveDto) {}
