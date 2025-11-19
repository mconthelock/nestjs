import { IsNotEmpty, IsString } from "class-validator";

export class CreateMatrixManualDto {
    @IsNotEmpty()
    @IsString()
    TITLE: string;

    @IsNotEmpty()
    @IsString()
    PATHFILE: string;

    @IsNotEmpty()
    @IsString()
    USERCREATE: string;
}
