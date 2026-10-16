import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, MaxLength, Min, ValidateNested } from 'class-validator';

export class PilineRejectPartDto {
    @IsString() @Matches(/^PI(?:\d{7}|\d{9})$/) PILINE_NO: string;
    @IsInt() @Min(1) QTY: number;
    @IsOptional() @IsString() @Matches(/^(?:(?:CN|PT|RQ)\d{2}-\d{6})?$/) REFNO?: string;
}
export class PilineRejectRequestDto {
    @IsString() @Matches(/^\d{5}$/) REQUESTER: string;
    @IsString() @Matches(/^\d{5}$/) INPUTBY: string;
    @IsInt() @Min(1) TID: number;
    @IsString() @Matches(/^\d{6}$/) SECCODE: string;
    @IsInt() @Min(1) CID: number;
    @IsInt() @IsIn([1,2,3,4,5]) WID: number;
    @IsString() @MaxLength(2000) PRONG: string;
    @IsString() @MaxLength(4000) EXPLAIN: string;
    @IsString() @MaxLength(4000) REMARK: string;
    @IsArray() @ArrayUnique() @ArrayMaxSize(100) @IsString({each:true}) RELATED: string[];
    @IsBoolean() URGENT: boolean;
    @IsOptional() @IsIn(['Y','N']) NEED_NEW_PART?: string;
    @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ValidateNested({each:true}) @Type(()=>PilineRejectPartDto) PARTS: PilineRejectPartDto[];
}
export class PilineRejectKeyDto {
    @IsInt() @IsIn([4]) NFRMNO: number;
    @IsString() @IsIn(['000101']) VORGNO: string;
    @IsString() @IsIn(['18']) CYEAR: string;
    @IsString() @Matches(/^20\d{2}$/) CYEAR2: string;
    @IsInt() @Min(1) NRUNNO: number;
}
export class SavePilineRejectDto {
    @ValidateNested() @Type(()=>PilineRejectKeyDto) KEY: PilineRejectKeyDto;
    @ValidateNested() @Type(()=>PilineRejectRequestDto) REQUEST: PilineRejectRequestDto;
}
