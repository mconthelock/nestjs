import { IsNotEmpty, IsString } from 'class-validator';
export class CreateDpmsPlMailDto {
    @IsNotEmpty()
    @IsString()
    VDISPLAY_NAME: string;

    @IsNotEmpty()
    @IsString()
    VEMAIL_ADDRESS: string;
}
