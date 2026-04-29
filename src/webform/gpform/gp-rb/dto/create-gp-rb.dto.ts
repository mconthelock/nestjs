import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGpRbDto {
    /*@IsNotEmpty()
    @IsString()
    @Type(() => String)
    REQBY: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    INPUTBY: string;*/
    
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    empName: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    empCode: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    empDept: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    empPos: string;
}
