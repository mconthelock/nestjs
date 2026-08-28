import { PartialType } from '@nestjs/swagger';
import { UpdateVendorDto } from './update-vendor.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchVendorDto extends PartialType(UpdateVendorDto) {
    @IsString()
    @IsOptional()
    IS_DETAIL?: string;
}
