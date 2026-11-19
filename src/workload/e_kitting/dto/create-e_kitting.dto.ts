import { IsString, MaxLength } from 'class-validator';

export class CreateEKittingDto {
    @IsString()
    @MaxLength(3)
    ITEM: string;

    @IsString()
    @MaxLength(100)
    DWG: string;

    @IsString()
    @MaxLength(5)
    EMPNO: string;
}
