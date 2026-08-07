import { PartialType } from '@nestjs/swagger';
import { CreateVannplanDto } from './create-vannplan.dto';

export class UpdateVannplanDto extends PartialType(CreateVannplanDto) {}
