import { PartialType } from '@nestjs/swagger';
import { CreateMedicalDto } from './create-medical.dto';

export class UpdateMedicalDto extends PartialType(CreateMedicalDto) {}
