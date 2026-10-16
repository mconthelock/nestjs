import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCmSmDto {
	@IsString()
	TINO: string;

	@IsString()
	REVNO: string;

	@IsString()
	columnName: string;

	@IsOptional()
	@IsString()
	columnTitle?: string;

	@IsOptional()
	@IsBoolean()
	mapped?: boolean;

	@IsOptional()
	value: string | Date | null;

	@IsOptional()
	@IsString()
	control?: string;

	@IsString()
	empno: string;
}
