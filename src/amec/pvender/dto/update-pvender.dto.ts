import { PartialType } from '@nestjs/swagger';
import { CreatePvenderDto } from './create-pvender.dto';

export class UpdatePvenderDto extends PartialType(CreatePvenderDto) {}
