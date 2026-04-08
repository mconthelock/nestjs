import { Injectable } from '@nestjs/common';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { QainsFormService } from './qains_form.service';
import { QainsFormRepository } from './qains_form.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { UsersSectionService } from 'src/escs/user_section/user_section.service';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { FormService } from 'src/webform/form/form.service';
import { deleteFile, moveFileFromMulter } from 'src/common/utils/files.utils';
import { QaFileService } from '../../qa_file/qa_file.service';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class QainsFormCreateService extends QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,

        private readonly formService: FormService,
        private readonly formCreateService: FormCreateService,
        private readonly orgposService: OrgposService,

        private readonly usersSectionService: UsersSectionService,

        private readonly qainsOAService: QainsOAService,
        private readonly qaFileService: QaFileService,
    ) {
        super(flowService, repo, mailService);
    }
    async createQainsForm(
        dto: CreateQainsFormDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQUESTER,
                    INPUTBY: dto.CREATEBY,
                    REMARK: dto.REMARK,
                },
                ip,
            );

            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }

            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            const condSetFlow = {
                ...form,
                CEXTDATA: '00',
            };
            // update flow qc sem
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

            // update flow req foreman
            await this.setFlow(
                { ...condSetFlow, CEXTDATA: '03' },
                dto.REQUESTER,
                dto.REQUESTER,
            );

            await this.create({
                ...form,
                QA_ITEM: dto.QA_ITEM,
                QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
                // QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
            });

            for (const e of dto.OPERATOR) {
                await this.qainsOAService.createQainsOA({
                    ...form,
                    QOA_TYPECODE: 'ESO',
                    QOA_EMPNO: e,
                });
            }

            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = path + '/' + formNo; // Get the destination path
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                // 2) บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
                await this.qaFileService.createQaFile({
                    ...form,
                    FILE_TYPECODE: 'ESF',
                    FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    FILE_USERCREATE: dto.REQUESTER,
                    FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                });
            }

            return {
                status: true,
                message: 'Request successful',
                data: dto,
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            return { status: false, message: 'Error: ' + error.message };
        }
    }
}
