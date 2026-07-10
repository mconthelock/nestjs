import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class UpdatePsdlcDetailDto {
    @IsOptional()
    @IsString()
    @Type(() => String)
    PNZUBA?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    PNHING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWCODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    NEWFLAG?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    REFERENCE?: string;
}

export class UpdateflowPSDLCDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
] as const) {
    @IsOptional()
    @IsString()
    @Type(() => String)
    CONTROLLER?: string;
}

export class UpdatedataPSDLCDto extends PickType(doactionFlowDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'EMPNO',
    'ACTION',
    'REMARK',
] as const) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CHANGE_STATUS: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    ACTUAL_DATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    ACTUAL_UPDATEBY: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdatePsdlcDetailDto)
    DETAILS?: UpdatePsdlcDetailDto[];
}
