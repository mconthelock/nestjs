import { PartialType } from '@nestjs/swagger';
import { CreateMarFileDto } from './create-mar-file.dto';

export class UpdateMarFileDto extends PartialType(CreateMarFileDto) {}
