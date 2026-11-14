import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
