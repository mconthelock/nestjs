import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDpmsPlOriginDto {
    @IsNotEmpty()
    @IsString()
    VPROD: string;

    @IsNotEmpty()
    @IsString()
    VP: string;

    @IsNotEmpty()
    @IsString()
    VTYPE: string;

    @IsNotEmpty()
    @IsString()
    VORDERS: string;

    @IsNotEmpty()
    @IsString()
    VCASE: string;

    @IsNotEmpty()
    @IsString()
    VITEM: string;

    @IsNotEmpty()
    @IsString()
    VPART: string;

    @IsNotEmpty()
    @IsString()
    VDRAWING: string;

    @IsOptional()
    @IsString()
    VDRAWINGL?: string;

    @IsNotEmpty()
    @IsString()
    VORIGIN: string;
}
