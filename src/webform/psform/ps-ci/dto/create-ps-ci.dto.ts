import { Type } from 'class-transformer';
import { IsNotEmpty, IsString,IsNumber } from 'class-validator';

export class CreatePsCiDto {}

export class GetDataFormDto {
	@Type(() => Number)
    @IsNumber()
	NFRMNO: number;

    @IsString()
	VORGNO: string;

    @Type(() => String)
	@IsString()
	CYEAR: string;

	@Type(() => String)
	@IsString()
	CYEAR2: string;

	@Type(() => Number)
    @IsNumber()
	NRUNNO: number;
}
