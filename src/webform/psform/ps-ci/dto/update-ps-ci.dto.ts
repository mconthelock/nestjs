import { PartialType } from '@nestjs/swagger';
import { CreatePsCiDto } from './create-ps-ci.dto';

export class UpdatePsCiDto extends PartialType(CreatePsCiDto) {}
