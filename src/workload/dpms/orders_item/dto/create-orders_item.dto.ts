import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
export class CreateOrdersItemDto {
    @IsString()
    ORDERNO: string;

    @IsString()
    ITEMNO: string;

    @IsDate()
    @Type(() => Date)
    PIS_ISSUEDATE: Date;

    @IsDate()
    @Type(() => Date)
    PIS_RECEIVEDATE: Date;

    @IsString()
    PB_CODE: string;

    @IsString()
    PB_DETAIL: string;

    @IsString()
    PB_USER: string;

    @IsDate()
    @Type(() => Date)
    PB_DATE: Date;

    @IsString()
    ITEM_ACCEPT_USER: string;

    @IsDate()
    @Type(() => Date)
    ITEM_ACCEPT_DATE: Date;

    @IsString()
    ITEM_ACCEPT_REMARK: string;

    @IsString()
    USER_UPDATE: string;

    @IsDate()
    @Type(() => Date)
    DATE_UPDATE: Date;
}
