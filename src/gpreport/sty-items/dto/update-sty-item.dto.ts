import { PartialType } from '@nestjs/swagger';
import { CreateStyItemDto } from './create-sty-item.dto';

export class UpdateStyItemDto extends PartialType(CreateStyItemDto) {}
