import { PartialType } from '@nestjs/swagger';
import { UpdateVendorDto } from './update-vendor.dto';

export class SearchVendorDto extends PartialType(UpdateVendorDto) {}
