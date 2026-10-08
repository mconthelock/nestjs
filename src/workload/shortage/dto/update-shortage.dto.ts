import { PartialType } from '@nestjs/swagger';
import { CreateShortageDto } from './create-shortage.dto';

export class UpdateShortageDto extends PartialType(CreateShortageDto) {}
