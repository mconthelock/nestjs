import { Injectable } from '@nestjs/common';
import { RequestIetsDto } from './dto/request-ie-ts.dto';
import { UpdateIetsDto } from './dto/update-ie-ts.dto';
import { IetsFormRepository } from './iets_form/iets_form.repository';
import { IetsListService } from './iets_list/iets_list.service';
import { IetsListRepository } from './iets_list/iets_list.repository';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { VorgmstService } from 'src/webform/vorgmst/vorgmst.service';
import { OrgposRepository } from 'src/webform/orgpos/orgpos.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormService } from 'src/webform/form/form.service';
import { Request } from 'express';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';
@Injectable()
export class IeTsService {
    constructor(
        protected readonly repotsf: IetsFormRepository,
        private readonly repoorgpos: OrgposRepository,
        protected readonly servicetsl: IetsListService,
        protected readonly repotsl: IetsListRepository,
        private readonly formCreateService: FormCreateService,
        private readonly orgService: VorgmstService,
        private readonly flowService: FlowService,
        protected readonly delService: DeleteFlowStepService,
        protected readonly doactionService: DoactionFlowService,
        protected readonly formService: FormService,
    ) {}
    async request(dto: RequestIetsDto, ip: string) {
        try {
            const { REQBY, INPUTBY, DRAFT, REMARK, DWGLIST, ...data } = dto;

            if (DWGLIST.length == 0) {
                return {
                    status: false,
                    message: 'TP and TC not changed',
                };
            }

            const uniqueItmNos = [...new Set(DWGLIST.map((item) => item.ITMNO))];
            if (uniqueItmNos.length == 0) {
                return {
                    status: false,
                    message: 'Item no is empty',
                };
            }
            const pic = await this.repotsf.getPicByItemNos(uniqueItmNos);
            const uniquePICs = [...new Set(pic.map((item) => item.PICINFO.SEMPNO))];
            const uniqueSections = [...new Set(pic.map((item) => item.PICINFO.SSECCODE))];
            if (uniquePICs.length == 0) {
                return {
                    status: false,
                    message: 'IE PIC not found',
                };
            } else if (uniquePICs.length > 3) {
                return {
                    status: false,
                    message: 'IE PIC more than system limit',
                };
            }
            if (uniqueSections.length > 1) {
                return {
                    status: false,
                    message: 'Section IE PIC more than one',
                };
            }

            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(DRAFT !== undefined && { DRAFT: DRAFT }),
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
            if (uniqueSections[0] != '051403') {
                const picsem = await this.repoorgpos.getOrgPos({
                    VPOSNO: '30',
                    VORGNO: uniqueSections[0],
                });
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CEXTDATA: '03', // CSTEPNO = 10: Form SEM  => IE SEM
                    },
                    VAPVNO: picsem[0].VEMPNO,
                });
            }
            //update step IE PIC
            const stepie = ['57', '58', '59'];
            let ind = 0;
            for (const pic of uniquePICs) {
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: stepie[ind], // PIC IE
                    },
                    VAPVNO: pic,
                });
                ind++;
            }
            const dataform = {
                ...form,
                JUNG: dto.JUNG,
                TSORGNO: dto.TSORGNO,
            };
            await this.repotsf.insert(dataform);
            if (DWGLIST && DWGLIST.length > 0) {
                await this.servicetsl.createMultipleLists(form, DWGLIST);
            }
            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            throw new Error('Request IE-TS Form Error: ' + error.message);
        }
    }

    async update(dto: UpdateIetsDto, ip: string) {
        try {
            const { ACTION, REQBY, INPUTBY, DRAFT, REMARK, DWGLIST, ...data } = dto;
            if (DWGLIST.length == 0) {
                return {
                    status: false,
                    message: 'TP and TC not changed',
                };
            }

            const uniqueItmNos = [...new Set(DWGLIST.map((item) => item.ITMNO))];
            if (uniqueItmNos.length == 0) {
                return {
                    status: false,
                    message: 'Item no is empty',
                };
            }
            const pic = await this.repotsf.getPicByItemNos(uniqueItmNos);
            const uniquePICs = [...new Set(pic.map((item) => item.PICINFO.SEMPNO))];
            const uniqueSections = [...new Set(pic.map((item) => item.PICINFO.SSECCODE))];
            if (uniquePICs.length == 0) {
                return {
                    status: false,
                    message: 'IE PIC not found',
                };
            } else if (uniquePICs.length > 3) {
                return {
                    status: false,
                    message: 'IE PIC more than system limit',
                };
            }
            if (uniqueSections.length > 1) {
                return {
                    status: false,
                    message: 'Section IE PIC more than one',
                };
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            if (uniqueSections[0] != '051403') {
                const picsem = await this.repoorgpos.getOrgPos({
                    VPOSNO: '30',
                    VORGNO: uniqueSections[0],
                });
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CEXTDATA: '03', // CSTEPNO = 10: Form SEM  => IE SEM
                    },
                    VAPVNO: picsem[0].VEMPNO,
                });
            }
            //update step IE PIC
            const stepie = ['57', '58', '59'];
            let ind = 0;
            for (const pic of uniquePICs) {
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: stepie[ind], // PIC IE
                    },
                    VAPVNO: pic,
                });
                ind++;
            }
            const dataform = {
                JUNG: dto.JUNG,
                TSORGNO: dto.TSORGNO,
            };
            await this.repotsf.update(form, dataform);
            if (DWGLIST && DWGLIST.length > 0) {
                await this.repotsl.deleteIets(form);
                await this.servicetsl.createMultipleLists(form, DWGLIST);
            }
            //send approve
            if (ACTION == 'request') {
                await this.formService.updateForm({
                    condition: { ...form },
                    CST: '1',
                });
                const resact = await this.doactionService.doAction(
                    {
                        ...form,
                        ACTION: 'approve',
                        EMPNO: dto.EMPNO,
                        REMARK: dto.REMARK,
                    },
                    ip,
                );
            }
            return {
                status: true,
                message: 'Update successful',
            };
        } catch (error) {
            throw new Error('Update IE-TS Form Error: ' + error.message);
        }
    }

    async getOrgMfg() {
        const res = await this.orgService.findAllActive();
        const filteredRes = res.filter(
            (item) =>
                item.VORGNO &&
                item.VORGNO.startsWith('060') &&
                item.VNAME &&
                item.VNAME.includes('SEC'),
        );
        return filteredRes;
    }

    findAll() {
        return `This action returns all ieTs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} ieT`;
    }

    remove(id: number) {
        return `This action removes a #${id} ieT`;
    }
}
