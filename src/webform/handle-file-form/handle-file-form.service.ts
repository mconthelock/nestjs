import { Injectable } from '@nestjs/common';
import { InsertAndMoveHandleFileFormDto } from './dto/create-handle-file-form.dto';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { FormmstService } from '../formmst/formmst.service';
import { FormService } from '../form/form.service';
import { IsFileService } from '../isform/is-file/is-file.service';
import { FormDto } from '../form/dto/form.dto';
import { PurFileService } from '../purform/pur-file/pur-file.service';
import { GpFileService } from '../gpform/gp-file/gp-file.service';
import { FinFileService } from '../finform/fin-file/fin-file.service';
import { FormAttachmentTypeService } from '../form-attachment-type/form-attachment-type.service';
import { IeFileService } from '../ieform/ie-file/ie-file.service';
import { FeFileService } from '../feform/fe-file/fe-file.service';
import { MarFileService } from '../marform/mar-file/mar-file.service';
import { MfgFileService } from '../mfgform/mfg-file/mfg-file.service';
import { PsFileService } from '../psform/ps-file/ps-file.service';

@Injectable()
export class HandleFileFormService {
    constructor(
        private readonly formmstService: FormmstService,
        private readonly formService: FormService,
        private readonly feFileService: FeFileService,
        private readonly finFileService: FinFileService,
        private readonly ieFileService: IeFileService,
        private readonly isFileService: IsFileService,
        private readonly gpFileService: GpFileService,
        private readonly marFileService: MarFileService,
        private readonly mfgFileService: MfgFileService,
        private readonly psFileService: PsFileService,
        private readonly purFileService: PurFileService,
        private readonly formAttachmentTypeService: FormAttachmentTypeService,
    ) {}

    async insertFiles(
        dto: InsertAndMoveHandleFileFormDto,
        file: Express.Multer.File | Express.Multer.File[],
    ) {
        const { FORM_TYPE, FILE_CODE, PATH, CREATEBY } = dto;
        try {
            if (!file || (Array.isArray(file) && file.length === 0)) {
                throw new Error('No file uploaded');
            }
            let fileType: number | undefined;
            if (FILE_CODE) {
                const fileTypeRes =
                    await this.formAttachmentTypeService.findOneByCode(
                        FILE_CODE,
                    );
                if (!fileTypeRes.status) {
                    throw new Error(
                        `File type with code ${FILE_CODE} not found`,
                    );
                }
                fileType = fileTypeRes.data.NID;
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const destination = await this.createDestinationPath(
                form,
                PATH,
                FORM_TYPE,
            );
            const moved = await this.moveAndInsertFile({
                files: Array.isArray(file) ? file : [file],
                destination,
                form,
                formType: FORM_TYPE,
                createBy: CREATEBY,
                fileType: fileType, // ส่งค่า NID ของประเภทไฟล์ถ้ามี FILE_CODE และพบข้อมูลในฐานข้อมูล
            });
            return {
                status: true,
                destination,
                moved,
            };
        } catch (error) {
            throw new Error(
                `Insert File ${FORM_TYPE} Form Error => ${error.message}`,
            );
        }
    }

    private async createDestinationPath(
        form: any,
        path: string,
        formType: string,
    ) {
        try {
            const formmst = await this.formmstService.getFormmstById(
                form.NFRMNO,
                form.VORGNO,
                form.CYEAR,
            );
            if (!formmst.status) {
                throw new Error('Form master not found for given form details');
            }
            const nameOfForm = formmst.data.VANAME;
            const formNo = await this.formService.getFormno(form);
            if (!nameOfForm.startsWith(formType)) {
                throw new Error(
                    `Form ${nameOfForm} does not match expected form type ${formType}`,
                );
            }
            const destination =
                path ??
                (await joinPaths(
                    process.env.AMEC_FILE_PATH,
                    process.env.STATE,
                    'Form',
                    formType,
                    nameOfForm,
                    formNo,
                ));
            return destination;
        } catch (error) {
            throw new Error(`Create destination path => ${error.message}`);
        }
    }

    private async moveAndInsertFile({
        files,
        destination,
        form,
        formType,
        fileType,
        createBy,
    }: {
        files: Express.Multer.File[];
        form: FormDto;
        destination: string;
        createBy: string;
        fileType?: number;
        formType: string;
    }) {
        try {
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const insertedFiles: any[] = [];
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                insertedFiles.push(
                    await this.handelInsertFileRecord(
                        {
                            ...form,
                            FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                            FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                            FILE_USERCREATE: createBy,
                            FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                            FILE_TYPE: fileType ?? null,
                        },
                        formType,
                    ),
                );
            }
            return {
                fullPath: movedTargets,
                data: insertedFiles,
            };
        } catch (error) {
            throw new Error(
                `Move and Insert File ${formType} => ${error.message}`,
            );
        }
    }

    private async handelInsertFileRecord(data: any, formType: string) {
        try {
            let res: { status: boolean; message: string; data?: any };
            switch (formType) {
                case 'FE':
                    res = await this.feFileService.create(data);
                    break;
                case 'FIN':
                    res = await this.finFileService.create(data);
                    break;
                case 'GP':
                    res = await this.gpFileService.create(data);
                    break;
                case 'IE':
                    res = await this.ieFileService.create(data);
                    break;
                case 'IS':
                    res = await this.isFileService.create(data);
                    break;
                case 'MAR':
                    res = await this.marFileService.create(data);
                    break;
                case 'MFG':
                    res = await this.mfgFileService.create(data);
                    break;
                case 'PS':
                    res = await this.psFileService.create(data);
                    break;
                case 'PUR':
                    res = await this.purFileService.create(data);
                    break;
                default:
                    throw new Error(`Unsupported form type: ${formType}`);
            }
            if (!res.status) {
                throw new Error(res.message);
            }
            return res.data;
        } catch (error) {
            throw new Error(
                `Insert File Record ${formType} : ${error.message}`,
            );
        }
    }
}
