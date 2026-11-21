import { IsOptional, IsString } from 'class-validator';

export class VendorCodeDto {
    @IsString()
    @IsOptional()
    VENDCODE?: string;

    @IsString()
    @IsOptional()
    VND_CODE?: string;
}
