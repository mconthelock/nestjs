import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class PcpDetailsDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(['A', 'E'])
    @Type(() => String)
    CMODE: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VMODEL?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VITEM_CODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VJOB_ITEMNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VSPEC?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VMATERIAL_CODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VDRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPART_NAME?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQUANTITY_YEAR?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPRES_VENDOR?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPRES_VENDOR_NAME?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPRES_MAKER?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRES_BASE_PRICE?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPRES_BASE_CURR?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRES_PRICE?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPRES_PRICE_CURR?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRES_PRICE_ETA_AMEC?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRES_AMOUNT?: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    VNEWITEM_CODE: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEWJOB_ITEMNO?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEWSPEC?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEWMATERIAL_CODE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEWDRAWING?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEWPART_NAME?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_VENDOR?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_VENDOR_NAME?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_MAKER?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NNEW_BASE_PRICE?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_BASE_CURR?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NNEW_PRICE?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_PRICE_CURR?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NNEW_PRICE_ETA_AMEC?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NNEW_AMOUNT?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NCOST_DIFF?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NCOST_AMOUNT?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NCOST_RATIO?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    CNEW_PRICE_YEAR?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VNEW_PRICE_MONTH?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VOLD_ITEM_COMPARE?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VPLANNER?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY1?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY2?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY3?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY4?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY5?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY6?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY7?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NQTY8?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE1?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE2?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE3?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE4?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE5?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE6?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE7?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPRICE8?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VQUOTATION_NO?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DQUOTATION_DATE?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DDIMAPV_DATE?: Date;

    @IsOptional()
    @IsString()
    @Type(() => String)
    VCOMMENT?: string;
}

export class CreatePcpDetailsDto extends PcpDetailsDto {

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;
}
