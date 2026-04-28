import { PartialType } from '@nestjs/swagger';
import { CreateGpRbDto } from './create-gp-rb.dto';

export class UpdateGpRbDto extends PartialType(CreateGpRbDto) {}
