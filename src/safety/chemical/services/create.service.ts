import { Injectable } from '@nestjs/common';
import { deleteFile } from 'src/common/utils/files.utils';
import { StyFilesService } from 'src/gpreport/sty-files/sty-files.service';
import { MasterRepository } from '../repository/master.repository';
import { FileRepository } from '../repository/file.repository';
import { CreateMasterDto } from '../dto/master.dto';
import { STY_FILES } from 'src/common/Entities/gpreport/table/STY_FILES.entity';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class CreateService {
    constructor(
        private readonly styFilesService: StyFilesService,
        private readonly masterRepo: MasterRepository,
        private readonly fileRepo: FileRepository,
        private readonly mailService: MailService,
    ) {}

    async main(dto: CreateMasterDto, files: Express.Multer.File[]) {
        const movedTargets: string[] = [];
        try {
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

            // TODO: notify manager via email when chemical info changes
            if(dto.USER_UPDATE){
                // ดึงข้อมูลหัวหน้าแต่ละแผนกที่ใช้สารเคมี
                await this.mailService.sendMail({
                    from: `Safety System<${process.env.MAIL_FROM}>`,
                    to: ''//email,
                    // subject: `Packing list issue notification [${project}]: ${period}  ${state}`,
                    // template: 'mfgreport/dpms/packing-list',
                    // context: {
                    //     list: lists,
                    // },
                    // bcc: process.env.MAIL_ADMIN,
                    // attachments: attachments,
                })
            }
            return {
                status: true,
                message: 'Create successfully',
                data: newData,
                files: fileData,
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw error;
        }
    }
}
