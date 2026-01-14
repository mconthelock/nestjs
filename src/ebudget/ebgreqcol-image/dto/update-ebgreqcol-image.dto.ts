import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqcolImageDto } from './create-ebgreqcol-image.dto';

export class UpdateEbgreqcolImageDto extends PartialType(CreateEbgreqcolImageDto) {}
