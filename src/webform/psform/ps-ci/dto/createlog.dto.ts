import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class EditedRowDto {
    ASSIGN_ID: number;
    REPORT_ID: number;
    IPROD: string;
    OLD_ACTUAL_QTY?: number;
    ACTUAL_QTY?: number;
    OLD_RANDOM_CHECK?: string;
    RANDOM_CHECK?: string;
    REMARK?: string;
    LEADER_REMARK?: string;
    IS_RANDOM_EDITED?: string;
    IS_ACTUAL_EDITED?: string;
}

export class CreateLogDto {
    @IsArray()
    @IsNotEmpty()
    // @Type(() => EditedRowDto)
    editedRows: EditedRowDto[];

    @IsString()
    @IsNotEmpty()
    empno: string;
}