import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateItemmasterDto {
    @IsString()
    IID: string;

    @IsString()
    IPROD: string;

    @IsString()
    IDESC: string;

    @IsString()
    IDRAW: string;

    @IsString()
    IGLNO: string;

    @IsString()
    IITYP: string;

    @IsString()
    ILEAD: number;

    @IsString()
    IUMS: string;

    @IsString()
    IUMP: string;

    @IsString()
    IABBT: string;

    @IsString()
    IPURC: string;

    @IsString()
    IBUYC: string;

    @IsString()
    BUYER: string;

    @IsString()
    BUYERNAME: string;

    @IsString()
    CODE: string;

    @IsString()
    ZONE: string;

    @IsString()
    USER_ID: string;

    @IsString()
    FOREMAN_ID: string;

    @IsString()
    ITEM_ADDR: string;

    @IsString()
    UPDATE_AT: Date;

    @IsString()
    UPDATE_BY: string;

    @IsString()
    USER_NAME: string;

    @IsString()
    USER_TNAME: string;

    @IsString()
    FOREMAN_NAME: string;

    @IsString()
    FOREMAN_TNAME: string;
}
