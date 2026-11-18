import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateVendorDto } from './update-vendor.dto';
import { CreateVendorDto } from './create-vendor.dto';
import { IsOptional, IsString, ValidateNested, IsDate } from 'class-validator';

export class SearchVendorDto extends PartialType(CreateVendorDto) {
    @IsString()
    @IsOptional()
    IS_DETAIL?: string;

    @IsString()
    @IsOptional()
    IS_EVA?: string;
}
