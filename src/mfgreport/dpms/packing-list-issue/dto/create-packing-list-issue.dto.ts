import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { ToBoolean } from 'src/common/utils/transform';

class HeaderPLDto {
    @IsNotEmpty()
    @IsString()
    VSHOPORDERNO: string;

    @IsNotEmpty()
    @IsString()
    VSUBJECT: string;

    @IsNotEmpty()
    @IsString()
    VNAMEOFBLDG: string;

    @IsNotEmpty()
    @IsString()
    VSOLDTO: string;
}

class DetailPLDto {
    @IsNotEmpty()
    @IsString()
    VCASE: string;

    @IsNotEmpty()
    @IsString()
    VMFGNO: string;

    @IsNotEmpty()
    @IsString()
    VITEM: string;

    @IsNotEmpty()
    @IsString()
    VPART: string;

    @IsNotEmpty()
    @IsString()
    VDRAWING: string;

    @IsOptional()
    @IsString()
    VDRAWINGL?: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NQTY: number;
}

class ListPLDto {
    @IsNotEmpty()
    @IsString()
    VCASE: string;

    @IsNotEmpty()
    @IsString()
    VMFGNO: string;

    @IsNotEmpty()
    @IsString()
    VPACKSTYLE: string;

    @IsNotEmpty()
    @IsString()
    VWIDTH: string;

    @IsNotEmpty()
    @IsString()
    VLENGTH: string;

    @IsNotEmpty()
    @IsString()
    VHEIGHT: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NNETWEIGHT: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NGROSSWEIGHT: number;

    @IsNotEmpty()
    @ValidateNested({ each: true, message: 'Each item in DETAILS must be a valid DetailPLDto' })
    @Type(() => DetailPLDto)
    DETAILS: DetailPLDto[];
}

export class CreatePackingListIssueDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ISSUETYPE: number;

    @IsNotEmpty()
    @IsString()
    SHIPPING_MARK: string;

    @IsNotEmpty()
    @IsString()
    VPROD: string;

    @IsNotEmpty()
    @IsString()
    VP: string;

    @IsNotEmpty()
    @IsString()
    VORDERS: string;

    @IsNotEmpty()
    @IsString()
    VTYPE: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NROUND?: number;

    @IsNotEmpty()
    @ValidateNested({ message: 'HEADER must be a valid HeaderPLDto' })
    @Type(() => HeaderPLDto)
    HEADER: HeaderPLDto;

    @IsNotEmpty()
    @ValidateNested({ each: true, message: 'Each item in LIST must be a valid ListPLDto' })
    @Type(() => ListPLDto)
    LIST: ListPLDto[];

    @IsNotEmpty()
    @IsString()
    HTML: string;

    @IsOptional()
    @IsString()
    HTMLPO?: string;

    @IsNotEmpty()
    @IsBoolean()
    @ToBoolean()
    SENDMAIL: boolean;
}
