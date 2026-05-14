import { PartialType } from '@nestjs/swagger';
import { CreateGpRbDto } from './create-gp-rb.dto';
import { ShowstampGpRbRepository } from '../gp-rb.repository';

export class UpdateGpRbDto extends PartialType(CreateGpRbDto) {}
