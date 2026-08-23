import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormmstGroupDto {
    @IsString()
    VGROUPORG: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    VGROUP?: number;

    @IsString()
    VGROUPNAME: string;
}
