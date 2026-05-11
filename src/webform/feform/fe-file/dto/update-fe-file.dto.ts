import { PartialType } from '@nestjs/swagger';
import { CreateFeFileDto } from './create-fe-file.dto';

export class UpdateFeFileDto extends PartialType(CreateFeFileDto) {}
