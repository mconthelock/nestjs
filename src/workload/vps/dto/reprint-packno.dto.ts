import { IsNotEmpty, IsString } from 'class-validator';

export class ReprintPackNoDto {
    @IsNotEmpty()
    @IsString()
    orderno: string;

    @IsNotEmpty()
    @IsString()
    sect: string;
}
