import { IsNotEmpty, IsString } from "class-validator";

export class CreateLockPiDto {

    @IsNotEmpty()
    @IsString()
    ITEM_NO: string;

    @IsNotEmpty()
    @IsString()
    ORD_NO: string;

    @IsNotEmpty()
    @IsString()
    LOCKED_BY_EMPNO: string;

    @IsNotEmpty()
    @IsString()
    SOCKET_ID: string;
}
