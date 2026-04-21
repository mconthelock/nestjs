import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReturnApvListDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VPROD: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VORD_NO: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VITEM: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NDRAWINGID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NSECID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NUSERCREATE: number;
}
