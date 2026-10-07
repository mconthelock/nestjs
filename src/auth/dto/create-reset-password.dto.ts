import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateResetPasswordDto {
    @IsString()
    USER_ID: string;

    @IsString()
    IP_ADDRESS: string;

    @IsString()
    USER_AGENT: string;
}
