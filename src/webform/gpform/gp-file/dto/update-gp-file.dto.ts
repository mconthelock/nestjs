import { PartialType } from '@nestjs/swagger';
import { CreateGpFileDto } from './create-gp-file.dto';

export class UpdateGpFileDto extends PartialType(CreateGpFileDto) {}
