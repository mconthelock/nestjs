import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumberString,
} from 'class-validator';

export class ReprintSearchDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumberString()
    page?: string = '1';

    @IsNotEmpty()
    @IsString()
    sect: string;
}
