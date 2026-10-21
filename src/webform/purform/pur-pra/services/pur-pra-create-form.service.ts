import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FlowService } from 'src/webform/flow/flow.service';
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
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { PurCpcService } from '../../pur-cpc/services/purcpc_form.service';
import { ImanageFlow, IinsertFile } from '../interface/create.interface';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';

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
        @Inject(forwardRef(() => PurCpcService))
        private readonly purCpcService: PurCpcService,
        private readonly doactionService: DoactionFlowService,
        private readonly flowService: FlowService,
        private readonly insertFlowService: InsertFlowStepService,
        private readonly deleteFlowService: DeleteFlowStepService,
    ) {}
    protected readonly path =
        `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PROPRA/` as string;

    async create(
        dto: CreatePurPraFormDto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        try {
            let form: FormDto;
            let message: string = 'Price approval form created successfully';
            if (dto.isReturn === true || dto.isSave === true) {
                message = 'Price approval form retrieved successfully';
                form = {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    CYEAR2: dto.CYEAR2,
                    NRUNNO: dto.NRUNNO,
                };
            } else {
                const formmst =
                    await this.formMstService.getFormMasterByVaname('PRO-PRA');
                const createForm = await this.createFormService.create(
                    {
                        NFRMNO: formmst.NNO,
                        VORGNO: formmst.VORGNO,
                        CYEAR: formmst.CYEAR,
                        REQBY: dto.REQBY,
                        INPUTBY: dto.INPUTBY,
                        ...(dto.isDraft ? { DRAFT: dto.DRAFT } : {}),
                        REMARK: dto.REMARK,
                    },
                    ip,
                );
                form = {
                    NFRMNO: createForm.data.NFRMNO,
                    VORGNO: createForm.data.VORGNO,
                    CYEAR: createForm.data.CYEAR,
                    CYEAR2: createForm.data.CYEAR2,
                    NRUNNO: createForm.data.NRUNNO,
                };
            }
            const deleteLists: number[] = dto.DELETE_LISTS || [];
            // สร้างลิงก์ระหว่างฟอร์ม Price approval และ Price comparison
            await this.insertLink(form, dto.PRICE_COMPARE_NO);

            // ตรวจสอบรายการและผลรวมเพื่อจัดการ flow
            await this.manageFlow({
                form,
                priceComparisonNo: dto.PRICE_COMPARE_NO,
            });

            // สร้าง Price approval form
            await this.createFormPRA(form, dto);

            // เพิ่่มรายการ change reason
            await this.createReason(form, dto.REASONS);

            // Insert file
            await this.insertFile({
                form,
                createBy: dto.INPUTBY,
                files,
                deleteLists: deleteLists,
                mode: dto.NMODE,
            });

            if (dto.isReturn === true) {
                await this.doactionService.doAction(
                    {
                        ...form,
                        EMPNO: dto.EMPNO,
                        REMARK: dto.REMARK,
                        ACTION: 'approve',
                    },
                    ip,
                );
            }

            return {
                status: true,
                message: message,
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
            VVENDOR: dto.VVENDOR || null,
            VPLANNER: dto.VPLANNER || null,
            VMATERIAL_CODE: dto.VMATERIAL_CODE || null,
            VMAKER: dto.VMAKER || null,
            VPART_NAME: dto.VPART_NAME || null,
            VMODEL_NAME: dto.VMODEL_NAME || null,
            VJOB_ITEM: dto.VJOB_ITEM || null,
            NCOMMITTEE: dto.NCOMMITTEE || null,
            NGROUP: dto.NGROUP || null,
            NTOTAL_PRES: dto.NTOTAL_PRES || 0,
            NTOTAL_NEW: dto.NTOTAL_NEW || 0,
            NTOTAL_COST: dto.NTOTAL_COST || 0,
            NTOTAL_RATIO: dto.NTOTAL_RATIO || 0,
            DEFT_MONTH_START: dto.DEFT_MONTH_START || null,
            DEFT_MONTH_END: dto.DEFT_MONTH_END || null,
            VEFT_TYPE: dto.VEFT_TYPE || null,
            VEFT_TYPE_OTHER: dto.VEFT_TYPE_OTHER || null,
            VDETAIL: dto.VDETAIL || null,
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
        // ลบทิ้งทั้งหมด
        if (!details || details.length === 0) {
            await this.praReasonRepo.delete(form);
            return;
        } else {
            await this.praReasonRepo.delete(form);
        }
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
    private async insertLink(form: FormDto, priceComparisonNo: string) {
        const priceApprovalNo = await this.formService.getFormno(form);
        // อัปเดตสถานะของฟอร์ม Price comparison เป็น 1 (CREATE) ก่อนที่จะลบลิงก์เก่า
        if (priceComparisonNo) {
            await this.purCpcService.updateStatus(priceComparisonNo, 1);
        }
        // ลบฟอร์มลิงก์เก่าที่เชื่อมโยงกับฟอร์ม Price comparison นี้ก่อนที่จะสร้างลิงก์ใหม่
        await this.formLinkService.delete(priceComparisonNo);
        await this.formLinkService.delete(priceApprovalNo);
        if (!priceApprovalNo || !priceComparisonNo) {
            return;
        }
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
        // update status ของ price comparison = 2 (USED)
        if (priceComparisonNo) {
            await this.purCpcService.updateStatus(priceComparisonNo, 2);
        }
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
    private async insertFile({
        form,
        createBy,
        files,
        deleteLists = [],
        mode,
    }: IinsertFile) {
        let code: string = '';
        if (mode == 1) {
            const files = await this.fileService.getFile({
                ...form,
                FORM_TYPE: 'PRO',
                FILE_CODE: 'PURPRA_PCP',
            });
            if (files.status) {
                deleteLists.push(...files.data.map((file) => file.FILE_ID));
            }
        }

        // ลบไฟล์ที่ถูกระบุให้ลบ (ถ้ามี)
        if (deleteLists && deleteLists.length > 0) {
            await this.fileService.deleteFileByIds(
                {
                    ...form,
                    FORM_TYPE: 'PRO',
                },
                deleteLists,
            );
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

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-21
     * @description จัดการ flow ของแบบฟอร์มตามรายการและผลรวมของการเปรียบเทียบราคา
     * @param form
     * @param priceComparisonNo
     */
    private async manageFlow({ form, priceComparisonNo }: ImanageFlow) {
        // ตรวจสอบรายการและผลรวมเพื่อจัดการ flow
        let insertFlow: boolean = false;

        const dim = await this.flowService.getFlow({
            ...form,
            CSTEPNO: '02',
        });
        const hasDim = dim && dim.length > 0;
        const priceComparison =
            await this.purCpcService.getForm(priceComparisonNo);
        if (priceComparison.status) {
            const data = priceComparison.data;
            outerLoop: for (const item of data) {
                if (item.NTOTAL_PRES >= 1000000 || item.NTOTAL_NEW >= 1000000) {
                    insertFlow = true;
                    break;
                }

                for (const detail of item.DETAILS) {
                    if (
                        detail.NPRES_AMOUNT >= 10000 ||
                        detail.NNEW_AMOUNT >= 10000
                    ) {
                        insertFlow = true;
                        break outerLoop;
                    }
                }
            }
            // หากยังไม่มี dim และต้องการ insert flow
            if (!hasDim && insertFlow) {
                await this.insertFlowService.insertFlowStep({
                    ...form,
                    CTYPE: '1',
                    BEFORESTEPNO: '57',
                    NEWSTEPNO: '02',
                    POSNO: '02',
                });
            }
            // หากมี dim และต้องการลบ flow
            else if (hasDim && !insertFlow) {
                await this.deleteFlowService.deleteFlowStep({
                    ...form,
                    CSTEPNO: '02',
                });
            }
        }
    }
}
