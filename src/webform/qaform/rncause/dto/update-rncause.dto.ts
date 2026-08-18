import { PartialType } from '@nestjs/swagger';
import { CreateRncauseDto } from './create-rncause.dto';

export class UpdateRncauseDto extends PartialType(CreateRncauseDto) {}
