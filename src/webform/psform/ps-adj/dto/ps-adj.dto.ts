import { Type } from 'class-transformer';
import {
    IsInt,
    Min,
    Max,
    IsString,
    IsNotEmpty,
    MaxLength,
    Length,
    IsOptional,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';

export class ReasonKeyDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 1)
    REASONNO: string;
}

export class ReasonValuesDto {
    @IsOptional()
    @IsString()
    @MaxLength(25)
    REASON?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(1)
    CSTDESC?: string | null;
}

export class CreateReasonDto extends IntersectionType(
    ReasonKeyDto,
    ReasonValuesDto,
) {}
export class UpdateReasonDto extends PartialType(ReasonValuesDto) {}
export class FindReasonDto extends PartialType(ReasonKeyDto, {
    skipNullProperties: false,
}) {}

export class OrderKeyDto {
    @Type(() => Number)
    @IsInt()
    @Min(-999)
    @Max(999)
    NFRMNO: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    VORGNO: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 2)
    CYEAR: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    CYEAR2: string;

    @Type(() => Number)
    @IsInt()
    @Min(-999999)
    @Max(999999)
    NRUNNO: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(11)
    CNTLNO: string;
}

export class OrderValuesDto {
    @IsOptional()
    @IsString()
    @MaxLength(9)
    ORDERNO?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    PROCID?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    QTY?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(17)
    DWGNO?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(16)
    DWGDESC?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(7)
    JUN?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(15)
    STOCKCODE?: string | null;

    @IsOptional()
    @IsInt()
    @Min(-99999999)
    @Max(99999999)
    PRNO?: number | null;

    @IsOptional()
    @IsInt()
    @Min(-99999999)
    @Max(99999999)
    LINENO?: number | null;

    @IsOptional()
    @IsInt()
    @Min(-99999)
    @Max(99999)
    VENDNO?: number | null;

    @IsOptional()
    @IsString()
    @MaxLength(6)
    REVQTY?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(1)
    REASONNO?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(225)
    DESCRIBE?: string | null;
}

export class CreateOrderDto extends IntersectionType(
    OrderKeyDto,
    OrderValuesDto,
) {}
export class UpdateOrderDto extends PartialType(OrderValuesDto) {}
export class FindOrderDto extends PartialType(OrderKeyDto, {
    skipNullProperties: false,
}) {}

export class FileKeyDto {
    @Type(() => Number)
    @IsInt()
    @Min(-999)
    @Max(999)
    NFRMNO: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(6)
    VORGNO: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 2)
    CYEAR: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 4)
    CYEAR2: string;

    @Type(() => Number)
    @IsInt()
    @Min(-999999)
    @Max(999999)
    NRUNNO: number;

    @IsString()
    @IsNotEmpty()
    @Length(2, 2)
    ID: string;
}

export class FileValuesDto {
    @IsOptional()
    @IsString()
    @MaxLength(70)
    SFILE?: string | null;
}

export class CreateFileDto extends IntersectionType(
    FileKeyDto,
    FileValuesDto,
) {}
export class UpdateFileDto extends PartialType(FileValuesDto) {}
export class FindFileDto extends PartialType(FileKeyDto, {
    skipNullProperties: false,
}) {}
