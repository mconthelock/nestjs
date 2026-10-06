import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestPurvmmScmuserDto {
    @IsOptional()
    @IsString()
    NAME?: string;

    @IsNotEmpty()
    @IsString()
    EMAIL: string;

    @IsNotEmpty()
    @IsString()
    USERNAME: string;
}
