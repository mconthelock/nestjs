import { Type } from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class CreatePsUpiListDataDto {
	@IsString()
	@IsNotEmpty()
	PUR_CODE: string;

	@IsString()
	@IsNotEmpty()
	DESC: string;

	@IsString()
	@IsNotEmpty()
	DRAWING: string;

	@IsString()
	@IsNotEmpty()
	ADDR: string;

	@IsString()
	@IsNotEmpty()
	WHI_USER: string;

	@IsString()
	@IsNotEmpty()
	REASON: string;

	@IsOptional()
	@IsString()
	UNIT?: string;

	@IsOptional()
	@IsString()
	REASON_REF_NO?: string;

    @IsOptional()
	@IsString()
	REASON_DETAIL?: string;

	@IsNumber()
	@Type(() => Number)
	QTY: number;

	@IsString()
	@IsNotEmpty()
	PRODUCTION: string;

	@IsString()
	@IsNotEmpty()
	ISSUE_TO: string;

	@IsString()
	@IsDateString()
	RETURN_DATE: string;
}

export class CreatePsUpiDto {
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	NFRMNO?: number;

	@IsOptional()
	@IsString()
	VORGNO?: string;

	@IsOptional()
	@IsString()
	CYEAR?: string;

	@IsOptional()
	@IsString()
	CYEAR2?: string;

	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	NRUNNO?: number;

	@IsString()
	@IsNotEmpty()
	INPUT_BY: string;

	@IsString()
	@IsNotEmpty()
	REQUEST_BY: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePsUpiListDataDto)
	LIST_DATA: CreatePsUpiListDataDto[];
}
