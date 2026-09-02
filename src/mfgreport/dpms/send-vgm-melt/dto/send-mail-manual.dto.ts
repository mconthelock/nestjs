import { PickType } from '@nestjs/swagger';
import { ExportExcelDto } from './export-excel.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMailManualDto extends PickType(ExportExcelDto, [
    'VANNDATE',
    'DATA',
] as const) {
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CREATEBY: string;
}
