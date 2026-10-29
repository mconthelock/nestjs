import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OwnOrgDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPNO: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    GROUP?: string;
}
