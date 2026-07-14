import { IsNotEmpty, IsString } from 'class-validator';

export class GetIdTagDto {
    @IsString()
    @IsNotEmpty()
    controlNo: string;
}