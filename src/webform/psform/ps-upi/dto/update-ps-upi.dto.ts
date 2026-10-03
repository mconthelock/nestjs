import { PartialType } from '@nestjs/swagger';
import { CreatePsUpiDto } from './create-ps-upi.dto';

export class UpdatePsUpiDto extends PartialType(CreatePsUpiDto) {}
