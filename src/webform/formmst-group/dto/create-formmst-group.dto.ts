import { IsString } from 'class-validator';

export class CreateFormmstGroupDto {
    @IsString()
    VGROUPORG: string;

    @IsString()
    VGROUP: string;

    @IsString()
    VGROUPNAME: string;
}
