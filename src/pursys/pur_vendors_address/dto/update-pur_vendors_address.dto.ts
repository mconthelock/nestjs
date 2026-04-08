import { PartialType } from '@nestjs/swagger';
import { CreatePurVendorsAddressDto } from './create-pur_vendors_address.dto';

export class UpdatePurVendorsAddressDto extends PartialType(CreatePurVendorsAddressDto) {}
