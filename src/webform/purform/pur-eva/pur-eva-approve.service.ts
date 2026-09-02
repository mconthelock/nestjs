import { Injectable } from '@nestjs/common';
import { PurevaFormService } from './pureva_form/pureva_form.service';
import { RequestPurevaFormDto } from './dto/request-pur-eva.dto';
import { CreatePurevaFormDto } from './pureva_form/dto/create-pureva_form.dto';
import { PurevaFormRepository } from './pureva_form/pureva_form.repository';
import { PurevaProfitTurnoverService } from './pureva_profit_turnover/pureva_profit_turnover.service';
import { CreatePurevaProfitTurnoverDto } from './pureva_profit_turnover/dto/create-pureva_profit_turnover.dto';
import { PurevaProfitTurnoverRepository } from './pureva_profit_turnover/pureva_profit_turnover.repository';
import { PurevaScoreService } from './pureva_score/pureva_score.service';
import { CreatePurevaScoreDto } from './pureva_score/dto/create-pureva_score.dto';
import { PurevaScoreRepository } from './pureva_score/pureva_score.repository';
import { PurnvfAddressService } from '../pur-nvf/purnvf_address/purnvf_address.service';
import { CreatePurnvfAddressDto } from '../pur-nvf/purnvf_address/dto/create-purnvf_address.dto';
import { PurnvfAddressRepository } from '../pur-nvf/purnvf_address/purnvf_address.repository';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { PurFileService } from '../pur-file/pur-file.service';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { deleteFile } from 'src/common/utils/files.utils';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UsersService } from 'src/amec/users/users.service';
import { PappflowService } from 'src/amec/pappflow/pappflow.service';
import { PurevaVendorRelationService } from './pureva_vendor_relation/pureva_vendor_relation.service';
import { ApprovePurevaFormDto } from './dto/approve-pur-eva.dto';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { VendorsService } from 'src/pursys/vendors/vendors.service';
import { PurVmmService } from '../pur-vmm/pur-vmm.service';

@Injectable()
export class PurEvaApproveService {
    constructor(
        protected readonly repo: PurevaFormService,
        protected readonly formService: FormService,
        protected readonly flowService: FlowService,
        protected readonly formmstService: FormmstService,
        protected readonly repService: RepService,
        protected readonly deleteFlowStepService: DeleteFlowStepService,
        protected readonly insertFlowStepService: InsertFlowStepService,
        private readonly formCreateService: FormCreateService,
        private readonly usrService: UsersService,
        private readonly pappFlowService: PappflowService,
        private readonly purevaFormRepo: PurevaFormRepository,
        private readonly doactionService: DoactionFlowService,
        private readonly vendorsService: VendorsService,
        private readonly purVmmService: PurVmmService,
    ) {}

    async approve(dto: ApprovePurevaFormDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const res = await this.purevaFormRepo.getData(form);
            if (dto.ACTION === 'approve' && dto.EXTDATA === '02') {
                if (res) {
                    if (res.VENDGROUP != '6:Non-Production (6)') {
                        const resform = await this.purevaFormRepo.update(form, {
                            MJUDGEMENT: dto.MJUDGEMENT,
                        });
                    } else {
                        const deleteResult =
                            await this.deleteFlowStepService.deleteFlowStep({
                                ...form,
                                CSTEPNO: '02',
                            });
                    }
                }
            }
            const resact = await this.doactionService.doAction(
                {
                    ...form,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            if (resact.status === true) {
                const cst = await this.formService.getFormStatus({ ...form });
                if (cst == '2') {
                    if (res.OPERATION == 'N') {
                        const today = new Date();
                        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                        let gp = res.VENDGROUP.match(/^\d+/)?.[0];
                        let p = '';
                        if (gp != '6') {
                            p = res.VENDPURPOSE.match(/^\d+/)?.[0];
                        }
                        const vnd = await this.vendorsService.create({
                            VND_NAME: res.COMNAME,
                            VND_REGISTED: new Date(formattedDate),
                            VND_STATUS: '0',
                            VENDGROUP: Number(gp),
                            VENDPURPOSE: Number(p),
                            VND_TERM: res.TERMCODE,
                            CREATE_BY: res.FORM.VREQNO,
                        });
                        const resupd = await this.purevaFormRepo.update(form, {
                            VENDCODE: vnd.VND_CODE,
                        });
                    }
                    if (
                        res.OPERATION == 'N' ||
                        (res.OPERATION == 'U' && res.UPSTATUS == 'Y')
                    ) {
                        const res = await this.purVmmService.createauto(
                            form,
                            ip,
                            `${process.env.AMEC_FILE_PATH}${process.env.STATE}/Form/PUR/PURVMM/`,
                        );
                    }
                }
            }

            return {
                status: true,
                message: 'Approve successful',
            };
        } catch (error) {
            throw new Error('Approve PUR-EVA Form Error: ' + error.message);
        }
    }
}
