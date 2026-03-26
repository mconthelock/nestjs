import { PartialType } from '@nestjs/mapped-types';
import { CreatePisFilesDto } from './create-pis-files.dto';

export class SearchPisFilesDto extends PartialType(CreatePisFilesDto) {}
