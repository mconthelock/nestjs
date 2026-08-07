import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateVannplanDto {
    @IsString()
    PRODUCTION: string;

    @IsString()
    ORDERNO: string;

    @IsString()
    SELECTION: string;

    @IsNumber()
    ORDERTYPE: number;

    @IsNumber()
    URGENTLY: number;

    @IsString()
    MFG_QC_PLAN: string;

    @IsString()
    POSTPONEVAN: string;

    @IsString()
    MASTERCY: string;

    @IsString()
    VANNDATE: string;

    @IsString()
    POSTPONEREM: string;

    @IsString()
    REMARK: string;

    @IsString()
    PROJECT: string;

    @IsString()
    MODEL: string;

    @IsString()
    P: string;

    @IsString()
    MARCOMPLETESET: string;

    @IsString()
    MARIMPORTANT: string;

    @IsString()
    WHDATA: string;

    @IsString()
    ISSUEPL: string;

    @IsString()
    ACTUALPL: string;

    @IsString()
    CONFIRMDATE: string;

    @IsString()
    SHIPBAL: string;

    @IsString()
    ACLVAN: string;

    @IsNumber()
    VANNSTATUS: number;

    @IsString()
    USERUPDATE: string;

    @IsDate()
    LASTUPDATE: Date;

    @IsNumber()
    MARKCOLOR: number;

    @IsNumber()
    MELTPLAN: number;

    @IsString()
    LASTUPDATEVANNDATE: string;

    @IsString()
    MOVETOMELTACT: string;

    @IsString()
    MASTERVANNINGPLAN: string;
}
