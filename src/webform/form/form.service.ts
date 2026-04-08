import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

import { FormmstService } from '../formmst/formmst.service';

import { FormWebformDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

import { FlowService } from 'src/webform/flow/flow.service';
import { FormDto } from './dto/form.dto';
import { empnoFormDto } from './dto/empno-form.dto';
import { SearchFormDto } from './dto/search-form.dto';
import { formDetailQb } from 'src/common/utils/qb-form-detail';
import { FormRepository } from './form.repository';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

// interface FormContext {
//     ip: string;
//     empno: string;
//     inputempno: string;
//     remark: string;
//     nfrmno: number;
//     vorgno: string;
//     cyear: string;
//     cyear2: string;
//     CSTEPSTDX: number;
//     flag?: number;
//     nrunno?: number;
//     emppos?: string;
//     orgno?: string;
//     represent?: string;
//     VAPVNO?: string;
//     CSTEPST?: number;
//     query?: any;
// }

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(FORM, 'webformConnection')
        protected readonly form: Repository<FORM>,

        @InjectRepository(FLOW, 'webformConnection')
        protected readonly flow: Repository<FLOW>,

        protected readonly formmstService: FormmstService,
        protected readonly flowService: FlowService,
        protected readonly repo: FormRepository,
    ) {}

    protected readonly mode_add = '1';
    protected readonly mode_edit = '2';
    protected readonly mode_view = '3';

    findOne(fno, orgno, cyear, cyear2, nrunno) {
        return this.form.find({
            where: {
                NFRMNO: fno,
                VORGNO: orgno,
                CYEAR: cyear,
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            },
            relations: {
                flow: true,
                creator: true,
            },
        });
    }

    async countForm({ flow, form }: any) {
        const qb = this.form.createQueryBuilder('form').leftJoin(
            'form.flow',
            'flow',
            Object.keys(flow || {}).length > 0
                ? Object.keys(flow)
                      .map((key) => `flow.${key} = :${key}`)
                      .join(' AND ')
                : '1=1',
            flow || {},
        );

        if (Object.keys(form || {}).length > 0) {
            Object.entries(form).forEach(([key, value]) => {
                if (
                    typeof value === 'string' &&
                    /^(>|<|>=|<=|!=)\s*/.test(value)
                ) {
                    const match = value.match(/^(>|<|>=|<=|!=)\s*(.+)$/);
                    if (match) {
                        const [, operator, actualValue] = match;
                        qb.andWhere(`form.${key} ${operator} :form_${key}`, {
                            [`form_${key}`]: actualValue,
                        });
                    }
                } else {
                    qb.andWhere(`form.${key} = :form_${key}`, {
                        [`form_${key}`]: value,
                    });
                }
            });
        }

        //return qb.getRawMany();
        const count = await qb.getCount();
        const minDateResult = await qb
            .clone()
            .select('MIN(form.DREQDATE)', 'minDate')
            .getRawOne();
        return { count: count, minDate: minDateResult?.minDate };
    }

    async countFlow({ flow, form }: any) {
        const qb = this.flow
            .createQueryBuilder('flow')
            .leftJoin('flow.form', 'form');

        const addConditions = (obj: any, alias: string) => {
            if (!obj || Object.keys(obj).length === 0) return;

            Object.entries(obj).forEach(([key, value]) => {
                if (
                    typeof value === 'string' &&
                    /^(>|<|>=|<=|!=)\s*/.test(value)
                ) {
                    const [operator, actualValue] = value.split(' ');
                    qb.andWhere(
                        `${alias}.${key} ${operator} :${alias}_${key}`,
                        {
                            [`${alias}_${key}`]: actualValue,
                        },
                    );
                } else {
                    qb.andWhere(`${alias}.${key} = :${alias}_${key}`, {
                        [`${alias}_${key}`]: value,
                    });
                }
            });
        };
        addConditions(flow, 'flow');
        addConditions(form, 'form');
        const [count, minDateResult] = await Promise.all([
            qb.getCount(),
            qb.clone().select('MIN(form.DREQDATE)', 'minDate').getRawOne(),
        ]);

        return { count, minDate: minDateResult?.minDate };
    }

    waitforapprove(empno) {
        return this.flow
            .createQueryBuilder('flow')
            .leftJoinAndSelect('flow.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
            .where(
                '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
                { step: '3', empno },
            )
            .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
            .getMany();
    }

    underprepare(empno) {
        return this.flow
            .createQueryBuilder('flow')
            .leftJoinAndSelect('flow.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
            .where(
                '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
                { step: '3', empno },
            )
            .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
            .getMany();
    }

    mine(empno) {
        return this.flow
            .createQueryBuilder('flow')
            .leftJoinAndSelect('flow.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
            .where(
                '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
                { step: '3', empno },
            )
            .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
            .getMany();
    }

    finish(empno, year) {
        return this.flow
            .createQueryBuilder('flow')
            .leftJoinAndSelect('flow.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'form_flow') // relation ใน entity ต้องตั้งชื่อถูก
            .where(
                '(flow.CSTEPST = :step AND flow.VAPVNO = :empno) OR (flow.CSTEPST = :step AND flow.VREPNO = :empno)',
                { step: '3', empno },
            )
            .andWhere('flow.CSTEPNO = form_flow.CSTEPNEXTNO')
            .getMany();
    }

    async getFormno(dto: FormDto): Promise<string> {
        const form = await this.formmstService.getFormmst({
            NNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
        });
        // เอาเลขปี 2 หลักสุดท้าย
        const year2 = dto.CYEAR2.substring(2, 4); // ถ้า "2024" ได้ "24"

        // เติมเลข running 6 หลัก (ถ้าเป็นเลข integer ให้แปลงเป็น string ก่อน)
        const runNo = String(dto.NRUNNO).padStart(6, '0'); // เช่น 1 => "000001"
        return `${form[0].VANAME}${year2}-${runNo}`;
    }

    async getPkByFormno(formno: string) {
        const vaname = formno.replace(/\d+/g, '').replace(/-$/, '');
        const formmst = await this.formmstService.getFormMasterByVaname(vaname);
        const split = formno.split('-');
        const form = {
            NFRMNO: formmst.NNO,
            VORGNO: formmst.VORGNO,
            CYEAR: formmst.CYEAR,
            CYEAR2: '20' + split[1].replace(/\D/g, ''),
            NRUNNO: Number(split[2]),
        };
        return {
            ...form,
            data: await this.getFormDetail(form),
        };
    }

    async insertForm(formData: FormWebformDto): Promise<boolean> {
        try {
            const res = await this.repo.create(formData);
            if (!res) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateForm(dto: UpdateFormDto): Promise<boolean> {
        try {
            const { condition, ...data } = dto;
            const res = await this.repo.update(condition, data);
            if (res.affected === 0) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async deleteFlowAndForm(
        dto: UpdateFormDto,
    ): Promise<{ form: UpdateFormDto; message: string; status: boolean }> {
        try {
            const condition = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            // Delete form data
            const flow = await this.flowService.deleteFlow(condition);
            const form = await this.repo.deleteForm(condition);

            return {
                form: dto,
                message:
                    form && flow.status
                        ? 'Form deleted successfully'
                        : 'Failed to delete form',
                status: form && flow.status,
            };
        } catch (error) {
            throw error;
        }
    }

    async getFormStatus(form: FormDto): Promise<string> {
        const data = await this.getCst(form);
        return data ? data.CST : '';
    }

    async getCst(form: FormDto) {
        return await this.repo.getCst(form);
    }

    async getFormDetail(form: FormDto) {
        return await this.repo.getFormDetail(form);
    }

    async createLink(form: FormDto) {
        let link = '';
        const frmmst = await this.formmstService.getFormmst({
            NNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
        });
        if (frmmst.length > 0) {
            const frmmstDetail = frmmst[0];
            let slash = '';
            if (!frmmstDetail.VFORMPAGE.startsWith('/')) {
                slash = '/';
            }
            link = frmmstDetail.VFORMPAGE.includes('amecweb')
                ? frmmstDetail.VFORMPAGE
                : `${process.env.APP_WEBFLOW}${slash}${frmmstDetail.VFORMPAGE}`;
            link += `?no=${form.NFRMNO}&orgNo=${form.VORGNO}&y=${form.CYEAR}&y2=${form.CYEAR2}&runNo=${form.NRUNNO}&empno=`;
        }
        return link;
    }

    async getMode(form: empnoFormDto) {
        const frm = await this.findOne(
            form.NFRMNO,
            form.VORGNO,
            form.CYEAR,
            form.CYEAR2,
            form.NRUNNO,
        );
        if (frm.length == 0) {
            return this.mode_add;
        }
        if (form.EMPNO == null || form.EMPNO == '') {
            return this.mode_view;
        }
        const flow = await this.flowService.getEmpFlowStepReady(form);
        return flow.length > 0 ? this.mode_edit : this.mode_view;
    }

    /**
     * Get request number from form data
     * @param string $reqNo e.g. ST-INP24-000001
     */
    async getRequestNo(reqNo: string) {
        const form = await this.crackRequestNo(reqNo);
        const res = { status: 0, data: [] };
        if (form.length > 0) {
            for (const f of form) {
                const formData = await this.getFormData(f);
                if (formData) {
                    formData.LINK = await this.createLink(f);
                    res.status = 1;
                    res.data.push(formData);
                }
            }
        }
        return res;
    }

    async getFormData(form: FormDto) {
        return await this.repo.getFormData(form);
    }

    async crackRequestNo(reqNo: string) {
        const split = reqNo.split('-');
        const vaname = split[0] + '-' + split[1].replace(/[0-9]/g, '');
        const formMst =
            await this.formmstService.getFormMasterByVanameAll(vaname);
        var res = [];
        if (formMst) {
            formMst.forEach((f) => {
                res.push({
                    NFRMNO: f.NNO,
                    VORGNO: f.VORGNO,
                    CYEAR: f.CYEAR,
                    CYEAR2: '20' + split[1].replace(/[a-zA-Z]/g, ''),
                    NRUNNO: parseInt(split[2]),
                });
            });
        }
        return res;
    }

    async searchForms(dto: SearchFormDto) {
        const form = await this.form.find({
            where: dto,
        });
        const result = [];
        for (const f of form) {
            const cond = {
                NFRMNO: f.NFRMNO,
                VORGNO: f.VORGNO,
                CYEAR: f.CYEAR,
                CYEAR2: f.CYEAR2,
                NRUNNO: f.NRUNNO,
            };
            const formDetail = await this.getFormDetail(cond);
            result.push(formDetail);
        }
        return result;
    }
}
