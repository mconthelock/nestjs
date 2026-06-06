import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDpmsPlFileDto {
    @IsNotEmpty()
    @IsString()
    VFILE_ONAME: string;

    @IsNotEmpty()
    @IsString()
    VFILE_FNAME: string;

    @IsNotEmpty()
    @IsString()
    VFILE_USERCREATE: string;

    @IsOptional()
    @Type(() => Number)
    NFILE_TYPE?: number;

    @IsNotEmpty()
    @IsString()
    VFILE_PATH: string;
}
