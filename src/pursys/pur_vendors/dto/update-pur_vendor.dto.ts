import { PartialType } from '@nestjs/swagger';
import { CreatePurVendorDto } from './create-pur_vendor.dto';

export class UpdatePurVendorDto extends PartialType(CreatePurVendorDto) {}
