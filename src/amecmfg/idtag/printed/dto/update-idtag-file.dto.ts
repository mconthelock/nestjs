import { PartialType } from '@nestjs/mapped-types';
import { CreateIdtagFilesDto } from './create-idtag-files.dto';

export class UpdateIdtagFilesDto extends PartialType(CreateIdtagFilesDto) {}
