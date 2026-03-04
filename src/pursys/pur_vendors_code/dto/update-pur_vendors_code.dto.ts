import { PartialType } from '@nestjs/swagger';
import { CreatePurVendorsCodeDto } from './create-pur_vendors_code.dto';

export class UpdatePurVendorsCodeDto extends PartialType(CreatePurVendorsCodeDto) {}
