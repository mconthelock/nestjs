import { PartialType } from '@nestjs/swagger';
import { CreatePurnvfLocationDto } from './create-purnvf_location.dto';

export class UpdatePurnvfLocationDto extends PartialType(CreatePurnvfLocationDto) {}
