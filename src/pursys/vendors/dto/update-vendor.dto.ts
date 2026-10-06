import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

import { CreateVendorDto } from './create-vendor.dto';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
    @IsString()
    VND_CODE: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    UPDATE_AT?: Date;

    @IsString()
    @IsOptional()
    UPDATE_BY?: string;
}
