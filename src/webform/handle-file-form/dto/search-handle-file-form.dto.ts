import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';
import { InsertAndMoveHandleFileFormDto } from './create-handle-file-form.dto';
export class SearchHandleFileFormDto extends PickType(
    InsertAndMoveHandleFileFormDto,
    [
        'NFRMNO',
        'VORGNO',
        'CYEAR',
        'CYEAR2',
        'NRUNNO',
        'FORM_TYPE',
        'FILE_CODE',
    ] as const,
) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    FILE_ID?: number;
}

export class QueryHandleFileFormDto extends PickType(SearchHandleFileFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
    'FILE_ID',
] as const) {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    FILE_TYPE?: number;
}
