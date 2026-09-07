import { IsString } from 'class-validator';
export class CreateReportDto {
    @IsString()
    VORGNO: string;

    @IsString()
    VNAME: string;

    @IsString()
    VURL: string;

    @IsString()
    CSTATUS: string;
}
