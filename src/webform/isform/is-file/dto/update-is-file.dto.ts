import { PartialType } from '@nestjs/swagger';
import { CreateIsFileDto } from './create-is-file.dto';

export class UpdateIsFileDto extends PartialType(CreateIsFileDto) {}
