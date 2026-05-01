import { PartialType } from '@nestjs/swagger';
import { CreateStyTypeDto } from './create-sty-type.dto';

export class UpdateStyTypeDto extends PartialType(CreateStyTypeDto) {}
