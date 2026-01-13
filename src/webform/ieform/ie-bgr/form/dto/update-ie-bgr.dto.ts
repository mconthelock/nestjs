import { PartialType } from '@nestjs/swagger';
import { CreateIeBgrDto } from './create-ie-bgr.dto';

export class UpdateIeBgrDto extends PartialType(CreateIeBgrDto) {}
