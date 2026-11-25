import { Injectable } from '@nestjs/common';
import { deleteFile } from 'src/common/utils/files.utils';
import { StyFilesService } from 'src/gpreport/sty-files/sty-files.service';
import { MasterRepository } from '../repository/master.repository';
import { FileRepository } from '../repository/file.repository';
import { CreateMasterDto } from '../dto/master.dto';
import { STY_FILES } from 'src/common/Entities/gpreport/table/STY_FILES.entity';
import { MailService } from 'src/common/services/mail/mail.service';
import { SectionRepository } from '../repository/section.repository';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { AmecUserAllService } from 'src/amec/amecuserall/amecuserall.service';
import { RevRepository } from '../repository/rev.repository';

@Injectable()
export class CreateService {
    constructor(
        private readonly styFilesService: StyFilesService,
        private readonly masterRepo: MasterRepository,
        private readonly sectionRepo: SectionRepository,
        private readonly fileRepo: FileRepository,
        private readonly mailService: MailService,
        private readonly amecuserAllService: AmecUserAllService,
        private readonly revRepo: RevRepository,
    ) {}

    async main(dto: CreateMasterDto, files: Express.Multer.File[]) {
        const movedTargets: string[] = [];
        try {
            const previousData = dto.AMEC_SDS_ID
                ? await this.masterRepo.getById(dto.AMEC_SDS_ID)
                : null;

            // ลบไฟล์ที่ถูกระบุใน DELETE_FILES
            if (dto.DELETE_FILES && dto.DELETE_FILES.length > 0) {
                await this.styFilesService.disable(
                    dto.DELETE_FILES,
                    dto.USER_UPDATE,
                );
                await this.fileRepo.deleteByFileId(dto.DELETE_FILES);
            }

            // บันทึกข้อมูล
            const result = await this.masterRepo.create(dto);
            if (!result) {
                throw new Error('Create failed');
            }
            const fileData: { fullPath: string[]; data: STY_FILES[] }[] = [];

            // บันทึกไฟล์
            for (const file of files) {
                const fieldname = {
                    SDS_FILE_ORIGIN: 'CHM_F_ORI',
                    CHEMICAL_IMAGE: 'CHM_IMAGE',
                    SDS_FILE_TRANS: 'CHM_F_TRANS',
                    SDS_STICKER: 'CHM_F_STICKER',
                };
                movedTargets.push(file.path);
                const insertFile = await this.styFilesService.insertFiles(
                    {
                        ...dto,
                        FILE_CODE: fieldname[file.fieldname],
                        FILE_USERCREATE: dto.USER_CREATE,
                    },
                    file,
                );
                movedTargets.push(...insertFile.moved.fullPath);
                fileData.push(insertFile.moved);
            }
            // insert ลงตารางเชื่อมข้อมูล STY_CHEMICAL_FILES
            for (const file of fileData) {
                for (const data of file.data) {
                    await this.fileRepo.create({
                        AMEC_SDS_ID: result.AMEC_SDS_ID,
                        FILE_ID: data.FILE_ID,
                    });
                }
            }

            const newData = await this.masterRepo.getMaster({
                status: 1,
                id: result.AMEC_SDS_ID,
            });

            const masterData = await this.revRepo.getMaster();

            // TODO: notify manager via email when chemical info changes
            if (dto.USER_UPDATE) {
                // ดึงข้อมูลหัวหน้าแต่ละแผนกที่ใช้สารเคมี
                const detail = this.getChangeDetails(previousData, result);

                const mailManager = await this.sectionRepo.getMailManagerbyId(
                    result.AMEC_SDS_ID,
                );
                if (mailManager.length > 0 && detail) {
                    const email = mailManager
                        .map((manager) => manager.EMAIL)
                        .join(', ');
                    const operator = await this.amecuserAllService.findEmp(
                        dto.USER_UPDATE,
                    );
                    await this.mailService.sendMail({
                        from: `Safety System<${process.env.MAIL_FROM}>`,
                        to:
                            process.env.NODE_ENV != 'production'
                                ? process.env.MAIL_ADMIN
                                : email,
                        subject: `Chemical information update notification: ${result.CHEMICAL_NAME}`,
                        template: 'safety/chemical/change-master-chemical',
                        context: {
                            id: result.AMEC_SDS_ID,
                            itemCode: result.PRODUCT_CODE,
                            chemicalName: result.CHEMICAL_NAME,
                            operator: operator.status
                                ? `${operator.data.STNAME}(${operator.data.SEMPNO})`
                                : '-',
                            dateUpdate: formatDate(result.UPDATE_DATE),
                            detail: detail,
                        },
                        bcc: process.env.MAIL_ADMIN,
                    });
                }
            }
            return {
                status: true,
                message: 'Create successfully',
                data: newData,
                master: masterData,
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen (24008)
     * @since 2026-11-25
     * @description สร้างรายละเอียดการเปลี่ยนแปลงข้อมูลสารเคมี โดยเปรียบเทียบข้อมูลเดิมกับข้อมูลปัจจุบัน
     * @param previousData
     * @param currentData
     * @returns
     */
    private getChangeDetails(
        previousData: Awaited<ReturnType<MasterRepository['getById']>>,
        currentData: Awaited<ReturnType<MasterRepository['create']>>,
    ): string {
        if (!previousData) {
            return 'เพิ่มข้อมูลสารเคมีใหม่';
        }

        const changes: {
            label: string;
            oldValue: string | number | Date;
            newValue: string | number | Date;
            isDate?: boolean;
        }[] = [
            {
                label: 'RECEIVED SDS DATE',
                oldValue: previousData.RECEIVED_SDS_DATE,
                newValue: currentData.RECEIVED_SDS_DATE,
                isDate: true,
            },
            {
                label: 'EFFECTIVE DATE',
                oldValue: previousData.EFFECTIVE_DATE,
                newValue: currentData.EFFECTIVE_DATE,
                isDate: true,
            },
            {
                label: 'Product Code / Item No.',
                oldValue: previousData.PRODUCT_CODE,
                newValue: currentData.PRODUCT_CODE,
            },
            {
                label: 'Chemical Name',
                oldValue: previousData.CHEMICAL_NAME,
                newValue: currentData.CHEMICAL_NAME,
            },
            {
                label: 'UN Class',
                oldValue: previousData.UN_CLASS,
                newValue: currentData.UN_CLASS,
            },
        ];

        const formatValue = (
            value: string | number | Date,
            isDate?: boolean,
        ) => (isDate ? formatDate(value, 'DD-MMM-YYYY') : String(value ?? '-'));
        const changedFields = changes.filter(
            ({ oldValue, newValue, isDate }) =>
                isDate
                    ? formatDate(oldValue, 'YYYY-MM-DD') !==
                      formatDate(newValue, 'YYYY-MM-DD')
                    : oldValue !== newValue,
        );

        return changedFields.length > 0
            ? changedFields
                  .map(
                      ({ label, oldValue, newValue, isDate }) =>
                          `${label}: ${formatValue(oldValue, isDate)} -> ${formatValue(newValue, isDate)}`,
                  )
                  .join('\n')
            : '';
    }
}
