import { PartialType } from '@nestjs/swagger';
import { CreateIeFileDto } from './create-ie-file.dto';

export class UpdateIeFileDto extends PartialType(CreateIeFileDto) {}
