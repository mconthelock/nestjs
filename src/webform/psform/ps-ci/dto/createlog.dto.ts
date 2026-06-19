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
    OLD_RECHECK_QTY?: number;
    RECHECK_QTY?: number;
    REMARK?: string;
    LEADER_REMARK?: string;
    RECHECK_REMARK?: string;
    ITEM_CODE: string;
    IS_RANDOM_EDITED?: string;
    IS_ACTUAL_EDITED?: string;
    IS_RECHECK_EDITED?: boolean;
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