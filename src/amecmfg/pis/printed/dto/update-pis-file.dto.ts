import { PartialType } from '@nestjs/mapped-types';
import { CreatePisFilesDto } from './create-pis-files.dto';

export class UpdateIdtagFilesDto extends PartialType(CreatePisFilesDto) {}
