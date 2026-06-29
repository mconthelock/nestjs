import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsString,
	ValidateNested,
} from 'class-validator';

export class CreateKanbanRequestDetailDto {
	@IsNotEmpty()
	@IsString()
	ITEM_CODE: string;

	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	QTY_REQ: number;

	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	QTY_PR: number;

	@IsString()
	REMARK: string;
}

export class CreateKanbanRequestDto {

	@IsString()
	@Type(() => String)
	EMPNO: string;

	@IsNotEmpty()
	@IsString()
	REQ_SECTION: string;

	@IsNotEmpty()
	@IsNumber()
	PRODUCT_CAT: number;

	@IsNotEmpty()
	@IsString()
	STATUS: string;

	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateKanbanRequestDetailDto)
	DETAIL: CreateKanbanRequestDetailDto[];
}
