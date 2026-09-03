import { IsString } from 'class-validator';

export class InsertErrLogDto {
    @IsString()
    order: string;
    @IsString()
    packing: string;
    @IsString()
    qrCode: string;
    @IsString()
    empno: string;
}
