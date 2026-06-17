import { PartialType } from '@nestjs/swagger';
import { CreateCheckinventoryDto } from './create-checkinventory.dto';

export class UpdateCheckinventoryDto extends PartialType(CreateCheckinventoryDto) {}
