import { Type } from 'class-transformer';
import { IsNotEmpty, IsString,IsNumber } from 'class-validator';

export class CreatePsCiDto {}

export class GetDataFormDto {
	@Type(() => Number)
    @IsNumber()
	nfrmno: number;

    @IsString()
	vorgno: string;

    @Type(() => String)
	@IsString()
	cyear: string;

	@Type(() => String)
	@IsString()
	cyear2: string;

	@Type(() => Number)
    @IsNumber()
	nrunno: number;
}
