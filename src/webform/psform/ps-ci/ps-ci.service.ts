import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/createlog.dto';
import { GetDataFormDto } from './dto/create-ps-ci.dto';
import { PsCiRepository } from './ps-ci.repository';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { InsertAndMoveHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';

@Injectable()
export class PsCiService {
    constructor(
        private readonly psCiRepo: PsCiRepository,
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    async getDataForm(body: GetDataFormDto) {
        return this.psCiRepo.getDataForm(body);
    }

    async createLog(body: CreateLogDto) {
        const { editedRows, empno } = body;

        const logs = editedRows.flatMap((row) => {
            const entries = [];

            if (row.ACTUAL_QTY !== undefined && row.ACTUAL_QTY !== null) {
                entries.push({
                    ASSIGN_ID: row.ASSIGN_ID,
                    ITEM_CODE: row.IPROD,
                    OLD_VALUE: row.OLD_ACTUAL_QTY ?? 0,
                    NEW_VALUE: row.ACTUAL_QTY ?? 0,
                    EDIT_BY: empno,
                    REMARK: row.REMARK ?? '',
                    TYPE: 1,
                });
            }

            if (row.RANDOM_CHECK !== undefined && row.RANDOM_CHECK !== null) {
                entries.push({
                    ASSIGN_ID: row.ASSIGN_ID,
                    ITEM_CODE: row.IPROD,
                    OLD_VALUE: row.OLD_RANDOM_CHECK,
                    NEW_VALUE: row.RANDOM_CHECK,
                    EDIT_BY: empno,
                    REMARK: row.LEADER_REMARK ?? '',
                    TYPE: 2,
                });
            }

            return entries;
        });

        await this.psCiRepo.saveLogs(logs);
        await this.psCiRepo.updateCheckResult(editedRows);
        return {
            status: true,
            message: 'success',
            count: logs.length,
        };
    }

    async getLogs(assignId: number) {
        return this.psCiRepo.getLogs(assignId);
    }

    // async updateCheckResult(data: any[]) {
    //     return this.psCiRepo.updateCheckResult(data);
    // }

    async uploadFile(body: InsertAndMoveHandleFileFormDto, file: Express.Multer.File[]) {
        return this.handleFileFormService.insertFiles(body, file);
    }
}
