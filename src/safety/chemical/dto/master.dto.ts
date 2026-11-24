import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class OwnOrgDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    EMPNO: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    GROUP?: string;
}

export class RebuildSectionDto {
    @IsNotEmpty()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    ID: number[];
}

class RebuildSecConfDto {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    OWNER: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    OWNERCODE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    AMEC_SDS_ID: number;
}

export class ConfirmRebuildSectionDto extends RebuildSectionDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => RebuildSecConfDto)
    SECTIONS: RebuildSecConfDto[];

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    USER_UPDATE: string;
}

export class DisableByIdDto extends PickType(ConfirmRebuildSectionDto, [
    'USER_UPDATE',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ID: number;
}

export class CreateMasterDto {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    RECEIVED_SDS_DATE: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    EFFECTIVE_DATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PRODUCT_CODE: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CHEMICAL_NAME: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VENDOR: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    PUR_INCHARGE: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    UN_CLASS: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    REV: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    USER_CREATE: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    USER_UPDATE?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    STATUS?: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    DELETE_FILES?: number[];
}
