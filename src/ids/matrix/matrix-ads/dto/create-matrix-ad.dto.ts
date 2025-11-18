import { IsNotEmpty, IsString } from "class-validator";

export class CreateMatrixAdDto {
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
