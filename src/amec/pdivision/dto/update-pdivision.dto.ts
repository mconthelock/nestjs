import { PartialType } from '@nestjs/mapped-types';
import { CreatePdivisionDto } from './create-pdivision.dto';

export class UpdatePdivisionDto extends PartialType(CreatePdivisionDto) {}
