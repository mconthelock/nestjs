import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InsertAndMoveStyFilesDto {
    @IsNotEmpty()
    @IsString()
    FILE_CODE: string;

    @IsNotEmpty()
    @IsString()
    FILE_USERCREATE: string;

    @IsOptional()
    @IsString()
    FILE_PATH?: string;

    @IsOptional()
    @Type(() => Number)
    STATUS?: number;
}

export class CreateStyFilesDto extends PickType(InsertAndMoveStyFilesDto, [
    'FILE_USERCREATE',
    'FILE_PATH',
    'STATUS',
] as const) {
    @IsNotEmpty()
    @IsString()
    FILE_ONAME: string;

    @IsNotEmpty()
    @IsString()
    FILE_FNAME: string;

    @IsOptional()
    @Type(() => Number)
    TYPE_ID?: number;

    @IsOptional()
    @IsString()
    FILE_USERUPDATE?: string;
}
