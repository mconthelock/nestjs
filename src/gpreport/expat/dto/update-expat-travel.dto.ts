import { PartialType } from '@nestjs/mapped-types';
import { CreateExpatTravelDto } from './create-expat-travel.dto';

export class UpdateExpatTravelDto extends PartialType(CreateExpatTravelDto) {}