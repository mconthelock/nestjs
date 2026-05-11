import { PartialType } from '@nestjs/swagger';
import { CreatePsFileDto } from './create-ps-file.dto';

export class UpdatePsFileDto extends PartialType(CreatePsFileDto) {}
