import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStyImageDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    IMAGE_ONAME: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    IMAGE_FNAME: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TYPE_ID: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    IMAGE_USERCREATE: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    IMAGE_PATH: string;
}
