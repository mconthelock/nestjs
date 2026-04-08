import { Injectable } from '@nestjs/common';
import {
    CreateQainsAuditDto,
    saveQainsAuditDto,
} from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { FormService } from 'src/webform/form/form.service';
import { QaFileService } from '../../qa_file/qa_file.service';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { QainsAuditRepository } from './qains_audit.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class QainsAuditService {
    constructor(
        private readonly repo: QainsAuditRepository,
        private readonly qainsOAService: QainsOAService,
        private readonly formService: FormService,
        private readonly qafileService: QaFileService,
    ) {}

    async saveAudit(
        dto: saveQainsAuditDto,
        files: Express.Multer.File[],
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            // delete old records
            await this.delete({
                ...form,
                QAA_TYPECODE: dto.typecode,
                QAA_AUDIT_SEQ: dto.auditSeq,
            });
            // insert new records
            for (const d of dto.data) {
                await this.create(d);
            }

            // update QainsOA
            await this.qainsOAService.update({
                ...form,
                QOA_TYPECODE: dto.typecode,
                QOA_SEQ: dto.auditSeq,
                QOA_AUDIT: dto.draft == true ? 2 : 1,
                QOA_RESULT: dto.res ?? null,
                QOA_PERCENT: dto.percent ?? null,
                QOA_GRADE: dto.grade ?? null,
                QOA_AUDIT_RESULT: dto.auditResult,
                QOA_IMPROVMENT_ACTIVITY: dto.auditActivity,
                QOA_STATION: dto.station ?? null,
                QOA_SCORE: dto.score ?? null,
            });
            // delete old files
            if (dto.delImageIds) {
                for (const id of dto.delImageIds) {
                    const file = await this.qafileService.getQaFileByID({
                        ...form,
                        FILE_TYPECODE: 'ESI',
                        FILE_ID: id,
                    });
                    const path = await joinPaths(
                        file.FILE_PATH,
                        file.FILE_FNAME,
                    );
                    await deleteFile(path);
                    await this.qafileService.delete({
                        ...form,
                        FILE_TYPECODE: 'ESI',
                        FILE_ID: id,
                    });
                }
            }
            // move files
            const formNo = await this.formService.getFormno(form); // Get the form number
            movedTargets = await this.qafileService.moveAndInsertFiles({
                files,
                form,
                path,
                folder: await joinPaths(formNo, dto.auditSeq.toString()),
                typecode: 'ESI',
                requestedBy: dto.actionBy,
                ext1: dto.auditSeq,
                ext2: dto.typecode,
            });
            return { status: true, message: 'Save audit successfully' };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw error;
        }
    }

    async create(dto: CreateQainsAuditDto) {
        try {
            await this.repo.insert(dto);
            return {
                status: true,
                message: 'Insert audit Successfully',
            };
        } catch (error) {
            throw new Error('Insert audit ' + error.message);
        }
    }

    async delete(dto: UpdateQainsAuditDto) {
        try {
            await this.repo.delete(dto);
            return { status: true, message: 'Delete master Successfully' };
        } catch (error) {
            throw new Error('Delete master Error: ' + error.message);
        }
    }
}
