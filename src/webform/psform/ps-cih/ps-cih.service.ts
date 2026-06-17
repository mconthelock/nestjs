import { Injectable } from '@nestjs/common';
import { GetDataFormDto } from './dto/create-ps-cih.dto';
import { UpdatePsCihDto } from './dto/update-ps-cih.dto';
import { PsCihRepository } from './ps-cih.repository';
import { CreateLogDto } from '../ps-ci/dto/createlog.dto';
import { PsCiRepository } from '../ps-ci/ps-ci.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { InsertAndMoveHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';

@Injectable()
export class PsCihService {
    constructor(
        private readonly psCihRepo: PsCihRepository,
        private readonly psCiRepo: PsCiRepository,
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    async getDataForm(dto: GetDataFormDto) {
        return this.psCihRepo.getDataForm(dto);
    }

    async insertLog(body: CreateLogDto) {
        const { editedRows, empno } = body;
        const dataToInsert = editedRows.flatMap((row) => {
            const data = [];
            if (row.IS_RANDOM_EDITED) {
                console.log('มี IS_RANDOM_EDITED');
                data.push({
                    REPORT_ID: row.REPORT_ID,
                    ITEM_CODE: row.ITEM_CODE,
                    OLD_VALUE: row.OLD_RANDOM_CHECK ?? '',
                    NEW_VALUE: row.RANDOM_CHECK ?? '',
                    EDIT_BY: empno,
                    REMARK: row.LEADER_REMARK ?? '',
                    TYPE: 2,
                });
            }

            if (row.IS_ACTUAL_EDITED) {
                console.log('มี IS_ACTUAL_EDITED');
                data.push({
                    REPORT_ID: row.REPORT_ID,
                    ITEM_CODE: row.ITEM_CODE,
                    OLD_VALUE: row.OLD_ACTUAL_QTY ?? 0,
                    NEW_VALUE: row.ACTUAL_QTY ?? 0,
                    EDIT_BY: empno,
                    REMARK: row.REMARK ?? '',
                    TYPE: 1,
                });
            }
            return data;
        });

        await this.psCiRepo.saveLogs(dataToInsert);
        await this.psCihRepo.updateCheckResult(editedRows, empno);
        console.log('Data to insert:', dataToInsert);

        // console.log('Inserting log with data:', body);
    }

    async getReportData(dto: FormDto) {
        return this.psCihRepo.getReportData(dto);
    }

    async uploadFile(
        body: InsertAndMoveHandleFileFormDto,
        file: Express.Multer.File[],
    ) {
        return this.handleFileFormService.insertFiles(body, file);
    }
}
