import { PartialType } from '@nestjs/swagger';
import { CreateRnwasteDto } from './create-rnwaste.dto';

export class UpdateRnwasteDto extends PartialType(CreateRnwasteDto) {}
