import { PartialType } from '@nestjs/swagger';
import { CreateWtypeDto } from './create-wtype.dto';

export class UpdateWtypeDto extends PartialType(CreateWtypeDto) {}
