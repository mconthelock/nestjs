import { Injectable } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { ReturnQainsFormDto } from './dto/return-qains_form.dot';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { QainsFormRepository } from './qains_form.repository';
import { MailService } from 'src/common/services/mail/mail.service';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { QaFileService } from '../../qa_file/qa_file.service';
import { UsersSectionService } from 'src/escs/user_section/user_section.service';
import { FormService } from 'src/webform/form/form.service';
import { moveFileFromMulter } from 'src/common/utils/files.utils';

@Injectable()
export class QainsFormReturnService extends QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,

        private readonly formService: FormService,
        private readonly orgposService: OrgposService,
        private readonly qainsOAService: QainsOAService,
        private readonly doactionFlowService: DoactionFlowService,
        private readonly qaFileService: QaFileService,
        private readonly usersSectionService: UsersSectionService,
    ) {
        super(flowService, repo, mailService);
    }
    async returnApproval(
        dto: ReturnQainsFormDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            // clear
            await this.qainsOAService.delete({ ...form, QOA_TYPECODE: 'ESO' });

            // clear files
            await this.qaFileService.delete({
                ...form,
                FILE_TYPECODE: 'ESF',
            });

            // insert operator
            for (const e of dto.OPERATOR) {
                await this.qainsOAService.createQainsOA({
                    ...form,
                    QOA_TYPECODE: 'ESO',
                    QOA_EMPNO: e,
                });
            }
            // update flow qc sem
            const condSetFlow = {
                ...form,
                CEXTDATA: '00',
            };
            const secData = await this.usersSectionService.getUserSecByID(
                dto.QA_INCHARGE_SECTION,
            );
            const qcsem = await this.orgposService.getOrgPos({
                VPOSNO: '30',
                VORGNO: secData.SSECCODE,
            });
            if (qcsem.length > 0) {
                await this.setFlow(
                    condSetFlow,
                    qcsem[0].VEMPNO,
                    qcsem[0].VEMPNO,
                );
                await this.setFlow(
                    { ...condSetFlow, CEXTDATA: '06' },
                    qcsem[0].VEMPNO,
                    qcsem[0].VEMPNO,
                );
            }

            await this.create({
                ...form,
                QA_ITEM: dto.QA_ITEM,
                QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
                // QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
            });

            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = path + '/' + formNo; // Get the destination path
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                await this.qaFileService.createQaFile({
                    ...form,
                    FILE_TYPECODE: 'ESF',
                    FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    FILE_USERCREATE: dto.EMPNO,
                    FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                });
            }

            // do action
            await this.doactionFlowService.doAction(
                {
                    ...form,
                    REMARK: dto.REMARK,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                },
                ip,
            );
            return {
                status: true,
                message: 'Action successful',
                data: dto,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
