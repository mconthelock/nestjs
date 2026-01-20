import { PartialType } from '@nestjs/swagger';
import { CreatePurFileDto } from './create-pur-file.dto';

export class UpdatePurFileDto extends PartialType(CreatePurFileDto) {}
