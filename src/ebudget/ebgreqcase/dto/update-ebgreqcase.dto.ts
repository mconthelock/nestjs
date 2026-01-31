import { PartialType } from '@nestjs/swagger';
import { CreateEbgreqcaseDto } from './create-ebgreqcase.dto';

export class UpdateEbgreqcaseDto extends PartialType(CreateEbgreqcaseDto) {}
