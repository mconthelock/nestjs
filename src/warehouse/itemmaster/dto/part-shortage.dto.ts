import { IsString, IsDate } from 'class-validator';

export class PartShortageDto {
    @IsString()
    CODE: string;

    @IsString()
    HIDE_SHORTAGE: string;

    @IsString()
    CREATED_BY: string;
}
