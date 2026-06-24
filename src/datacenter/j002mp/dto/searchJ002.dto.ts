import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class getData {
    @IsOptional()
    @IsString()
    @Type(() => String)
    PURITEM?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ISSUENO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    SCHEDULE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ISSUETO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ITEM?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    ORDER?: string;
}
