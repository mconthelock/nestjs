import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqattfileDto } from './create-ebgreqattfile.dto';

export class UpdateEbgreqattfileDto extends PartialType(CreateEbgreqattfileDto) {}
