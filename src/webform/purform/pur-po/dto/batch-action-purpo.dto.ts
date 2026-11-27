import { Type } from 'class-transformer';
import {
    IsArray,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class PurPoFormKeyDto {
    @Type(() => Number)
    @IsInt()
    NFRMNO: number;

    @IsString()
    @IsNotEmpty()
    VORGNO: string;

    @IsString()
    @IsNotEmpty()
    CYEAR: string;

    @IsString()
    @IsNotEmpty()
    CYEAR2: string;

    @Type(() => Number)
    @IsInt()
    NRUNNO: number;
}

export class BatchActionPurPoDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurPoFormKeyDto)
    items: PurPoFormKeyDto[];

    @IsIn(['approve', 'return', 'reject'])
    action: 'approve' | 'return' | 'reject';

    @IsString()
    @IsNotEmpty()
    empno: string;

    @IsOptional()
    @IsString()
    remark?: string;
}
