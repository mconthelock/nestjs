import { PartialType } from '@nestjs/mapped-types';
import { CreateIdtagFilesDto } from './create-idtag-files.dto';

export class SearchIdtagFilesDto extends PartialType(CreateIdtagFilesDto) {}
