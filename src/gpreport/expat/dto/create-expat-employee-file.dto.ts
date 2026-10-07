import {
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateExpatEmployeeFileDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    FILE_TYPE: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    FILE_NAME: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    FILE_PATH: string;

}