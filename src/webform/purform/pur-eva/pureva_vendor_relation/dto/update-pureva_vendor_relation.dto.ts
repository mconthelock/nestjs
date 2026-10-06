import { PartialType } from '@nestjs/swagger';
import { CreatePurevaVendorRelationDto } from './create-pureva_vendor_relation.dto';

export class UpdatePurevaVendorRelationDto extends PartialType(CreatePurevaVendorRelationDto) {}
