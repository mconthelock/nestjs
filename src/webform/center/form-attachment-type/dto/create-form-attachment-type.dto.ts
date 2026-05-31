import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormAttachmentTypeDto {
    @IsNotEmpty()
    @IsString()
    VCODE: string;

    @IsNotEmpty()
    @IsString()
    VDESCRIPTION: string;
}
