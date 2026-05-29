import { PartialType } from '@nestjs/swagger';
import { CreateDevplanDto } from './create-devplan.dto';

export class UpdateDevplanDto extends PartialType(CreateDevplanDto) {}
