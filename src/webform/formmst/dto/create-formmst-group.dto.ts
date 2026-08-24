import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormmstGroupDto {
    @IsString()
    VGROUPORG: string;

    @IsString()
    @IsOptional()
    VGROUP?: string;

    @IsString()
    VGROUPNAME: string;
}
