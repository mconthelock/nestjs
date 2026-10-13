import { Injectable } from '@nestjs/common';
import { CreatePurPraFormDto } from '../dto/create-pur-pra-form.dto';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormRepository } from '../repository/form.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { CreatePurPraReasonDto } from '../dto/create-pur-pra-reason.dto';
import { ReasonRepository } from '../repository/reason.repository';
import { FormService } from 'src/webform/form/form.service';
import { FormLinkService } from 'src/webform/form-link/form-link.service';
import { joinPaths } from 'src/common/utils/files.utils';
import { CreatePurCpcService } from '../../pur-cpc/services/purcpc_create.service';

@Injectable()
export class PurPraCreateService {
    constructor(
        private readonly fileService: HandleFileFormService,
        private readonly createFormService: FormCreateService,
        private readonly formService: FormService,
        private readonly formMstService: FormmstService,
        private readonly formLinkService: FormLinkService,
        private readonly praFormRepo: FormRepository,
        private readonly praReasonRepo: ReasonRepository,
        private readonly purCpcService: CreatePurCpcService,
    ) {}
    protected readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PROPRA/` as string;

    async create(
        dto: CreatePurPraFormDto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        try {
            const formmst =
                await this.formMstService.getFormMasterByVaname('PRO-PRA');
            const createForm = await this.createFormService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    DRAFT: dto.DRAFT,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            // สร้างลิงก์ระหว่างฟอร์ม Price approval และ Price comparison
            if (dto.NMODE == 1) {
                const priceApvDetail = await this.formService.getFormno(form);
                await this.insertLink(priceApvDetail, dto.PRICE_COMPARE_NO);
            }

            // สร้าง Price approval form
            await this.createFormPRA(form, dto);

            // เพิ่่มรายการ change reason
            await this.createReason(form, dto.REASONS);

            // Insert file
            await this.insertFile(form, dto.INPUTBY, files);

            return {
                status: true,
                message: 'Price approval form created successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-12
     * @description Create Price approval form
     * @param form
     * @param dto
     */
    private async createFormPRA(form: FormDto, dto: CreatePurPraFormDto) {
        const data = {
            ...form,
            NMODE: dto.NMODE,
            VVENDOR: dto.VVENDOR,
            VPLANNER: dto.VPLANNER,
            VMATERIAL_CODE: dto.VMATERIAL_CODE,
            VMAKER: dto.VMAKER,
            VPART_NAME: dto.VPART_NAME,
            VMODEL_NAME: dto.VMODEL_NAME,
            VJOB_ITEM: dto.VJOB_ITEM,
            NCOMMITTEE: dto.NCOMMITTEE,
            NGROUP: dto.NGROUP,
            NTOTAL_PRES: dto.NTOTAL_PRES,
            NTOTAL_NEW: dto.NTOTAL_NEW,
            NTOTAL_COST: dto.NTOTAL_COST,
            NTOTAL_RATIO: dto.NTOTAL_RATIO,
            DEFT_MONTH_START: dto.DEFT_MONTH_START,
            DEFT_MONTH_END: dto.DEFT_MONTH_END,
            VEFT_TYPE: dto.VEFT_TYPE,
            VEFT_TYPE_OTHER: dto.VEFT_TYPE_OTHER,
            VDETAIL: dto.VDETAIL,
        };
        const createForm = await this.praFormRepo.create(data);
        if (!createForm) {
            throw new Error('Failed to create Price approval form');
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-12
     * @description Create reasons for the given price approval form
     * @param form The form data for which the reasons are being created
     * @param details The list of reason details to be created
     */
    private async createReason(
        form: FormDto,
        details: CreatePurPraReasonDto[],
    ) {
        const createReason = await this.praReasonRepo.create(
            details.map((item) => ({
                ...form,
                ...item,
            })),
        );
        if (!createReason) {
            throw new Error('Failed to create Price approval reason');
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-12
     * @description Insert link between price approval and price comparison
     * @param priceApprovalNo
     * @param priceComparisonNo
     */
    private async insertLink(
        priceApprovalNo: string,
        priceComparisonNo: string,
    ) {
        // ลบฟอร์มลิงก์เก่าที่เชื่อมโยงกับฟอร์ม Price comparison นี้ก่อนที่จะสร้างลิงก์ใหม่
        await this.formLinkService.delete(priceComparisonNo);
        // สร้างลิงก์ใหม่ระหว่างฟอร์ม Price approval และ Price comparison
        const link = await this.formLinkService.create({
            VFORM1: priceApprovalNo,
            VFORM2: priceComparisonNo,
        });
        if (!link) {
            throw new Error(
                'Failed to insert link between price approval and price comparison',
            );
        }
        // update status ของ price comparison = 2
        await this.purCpcService.updateStatus(priceComparisonNo, 2);
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-12
     * @description Insert files for the given price approval form
     * @param form 
     * @param createBy 
     * @param files 
     * @param deleteLists 
     */
    private async insertFile(
        form: FormDto,
        createBy: string,
        files: Express.Multer.File[],
        deleteLists: number[] = []
    ) {
        let code: string = '';

        // ลบไฟล์ที่ถูกระบุให้ลบ (ถ้ามี)
        if (deleteLists && deleteLists.length > 0) {
            await this.fileService.deleteFileByIds({
                ...form,
                FORM_TYPE: 'PRO',
            }, deleteLists)
        }
        const formNo = await this.formService.getFormno(form);
        const destination = await joinPaths(this.path, formNo);
        for (const file of files) {
            switch (file.fieldname) {
                case 'IMAGE_DETAIL':
                    code = 'PURPRA_DTL';
                    break;
                case 'FILE_QUOTATION':
                    code = 'PURPRA_QUO';
                    break;
                case 'FILE_ADDITIONAL':
                    code = 'PURPRA_ADT';
                    break;
                case 'PRICE_COMPARE_FILE':
                    code = 'PURPRA_PCP';
                    break;
                default:
                    throw new Error(
                        `Unsupported file fieldname: ${file.fieldname}`,
                    );
            }
            const createFile = await this.fileService.insertFiles(
                {
                    ...form,
                    FORM_TYPE: 'PRO',
                    FILE_CODE: code,
                    PATH: destination,
                    CREATEBY: createBy,
                },
                file,
            );
        }
    }
}
