import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { SearchFlowDto } from './dto/search-flow.dto';
import { getSafeFields } from 'src/common/utils/Fields.utils';
import { CreateFlowDto } from './dto/create-flow.dto';
import { FormDto } from '../form/dto/form.dto';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Injectable()
export class FlowRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    private readonly APV_TYPE_SINGLE = '1';
    private readonly APV_TYPE_MULTIPLE_CAN = '2';
    private readonly APV_TYPE_MULTIPLE_CO = '3';
    private readonly APV_TYPE_MULTIPLE = '3';
    private readonly APPLY_ALL_NONE = '0';
    private readonly APPLY_ALL_APV = '1';
    private readonly APPLY_ALL_REJ = '2';
    private readonly APPLY_ALL_BOTH = '3';
    private readonly APV_NONE = '0';
    private readonly APV_APPROVE = '1';
    private readonly APV_REJECT = '2';
    private readonly APV_UNKNOWN = '3';
    private readonly APV_RETURN = '4';
    private readonly STEP_NOT_USE = '0';
    private readonly STEP_USE = '1';
    private readonly STEP_NORMAL = '1';
    private readonly STEP_WAIT = '2';
    private readonly STEP_READY = '3';
    private readonly STEP_PASS = '4';
    private readonly STEP_APPROVE = '5';
    private readonly STEP_REJECT = '6';
    private readonly STEP_SKIP = '7';
    private readonly STEP_DIE = '8';
    private readonly STEP_RETURN = '9';
    private readonly FLOW_PREPARE = '0';
    private readonly FLOW_ON_GOING = '1';
    private readonly FLOW_RUNNING = '1';
    private readonly FLOW_APPROVE = '2';
    private readonly FLOW_REJECT = '3';

    private readonly FLOW_FIELDS = this.manager
        .getRepository(FLOW)
        .metadata.columns.map((c) => c.propertyName);

    create(dto: CreateFlowDto) {
        return this.getRepository(FLOW).save(dto);
    }

    update(condition: any, data: UpdateFlowDto) {
        return this.manager.getRepository(FLOW).update(condition, data);
    }

    delete(dto: UpdateFlowDto) {
        return this.manager.getRepository(FLOW).delete(dto);
    }

    async reAlignFlow(dto: UpdateFlowDto) {
        return await this.manager
            .getRepository(FLOW)
            .createQueryBuilder()
            .update()
            .set({ CSTEPST: () => 'CSTEPST - 1' })
            .where(dto)
            .andWhere('CSTEPST > 1')
            .andWhere('CSTEPST < 5')
            .execute();
    }

    getFlow(dto: SearchFlowDto) {
        const query = this.manager
            .getRepository(FLOW)
            .createQueryBuilder('flow')
            .distinct(dto.distinct == true); // เปิด distinct

        for (const key in dto) {
            if (dto[key] == null || key == 'distinct') continue;

            if (key === 'CAPVSTNO') {
                if (Array.isArray(dto[key])) {
                    query.andWhere(`flow.${key} IN (:...${key})`, {
                        [key]: dto[key],
                    });
                } else {
                    query.andWhere(`flow.${key} = :${key}`, {
                        [key]: dto[key],
                    });
                }
            } else if (key === 'fields') {
                const select = getSafeFields(dto.fields, this.FLOW_FIELDS);
                select.length > 0 &&
                    query.select(select.map((f) => `flow.${f}`));
            } else {
                query.andWhere(`flow.${key} = :${key}`, { [key]: dto[key] });
            }
        }
        return query.getMany();
    }

    getFlowTree(form: FormDto) {
        return this.manager.getRepository(FLOW).query(
            `
            SELECT DISTINCT LEVEL, CSTEPNO, CSTEPNEXTNO, CSTEPST, CEXTDATA, VAPVNO, SRECMAIL, NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, SNAME, VNAME, DAPVDATE, CAPVTIME, VREMARK,  VREPNO, VREALAPV
            FROM FLOW, AMECUSERALL, stepmst  WHERE  FLOW.VAPVNO = SEMPNO and flow.CSTEPNO = cno
            start with CSTART = '1' and
            NFRMNO = :1 and VORGNO = :2 and CYEAR = :3
            and CYEAR2 = :4 and NRUNNO = :5
            connect by
            NFRMNO = prior NFRMNO and VORGNO = prior VORGNO and CYEAR = prior CYEAR
            and CYEAR2 = prior CYEAR2 and NRUNNO = prior NRUNNO
            and CSTEPNO = prior CSTEPNEXTNO
            order by level
        `,
            [form.NFRMNO, form.VORGNO, form.CYEAR, form.CYEAR2, form.NRUNNO],
        );

        //   const sql =
        //     `SELECT DISTINCT LV, TO_CHAR(this.APPLY_ALL_APV.NFRMNO) AS NFRMNO2, TO_CHAR(this.APPLY_ALL_APV.NRUNNO) AS NRUNNO2, A.*, SNAME, SPOSITION, VNAME, CST
        //     FROM FORM F
        //     JOIN (
        //         SELECT DISTINCT LEVEL AS LV, FLOW.*
        //         FROM FLOW
        //         START WITH
        //             NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno AND CSTART = '1'
        //         CONNECT BY
        //             NFRMNO = :frm2 and VORGNO = :org2 AND CYEAR = :cyear AND CYEAR2 = :cyear2 AND NRUNNO = :runno2 AND CSTEPNO = PRIOR CSTEPNEXTNO
        //     ) A ON F.NFRMNO = A.NFRMNO AND F.VORGNO = A.VORGNO AND F.CYEAR = A.CYEAR AND F.CYEAR2 = A.CYEAR2 AND F.NRUNNO = A.NRUNNO
        //     JOIN AMEC.AEMPLOYEE E ON E.SEAMPNO = A.VAPVNO
        //     JOIN AMEC.PPOSITION P ON P.SPOSCODE = E.SPOCODE
        //     JOIN STEPMST S ON A.CSTEPNO = S.CNO
        //     ORDER BY A.LV
        //     `;
        //   const params = {
        //     ...form,
        //     frm: form.NFRMNO,
        //     org: form.VORGNO,
        //     y: form.CYEAR,
        //     y2: form.CYEAR2,
        //     runno: form.NRUNNO,
        //     frm2: form.NFRMNO,
        //     org2: form.VORGNO,
        //     cyear: form.CYEAR,
        //     cyear2: form.CYEAR2,
        //     runno2: form.NRUNNO,
        //   };
        //   await this.execSql(
        //     sql,
        //     params,
        //     queryRunner,
        //     'Reset flow',
        //   );
    }

    async getEmpFlowStepReady(form: empnoFormDto) {
        return this.manager
            .getRepository(FLOW)
            .createQueryBuilder('f')
            .where('f.NFRMNO = :nfrmno', { nfrmno: form.NFRMNO })
            .andWhere('f.VORGNO = :vorgno', { vorgno: form.VORGNO })
            .andWhere('f.CYEAR = :cyear', { cyear: form.CYEAR })
            .andWhere('f.CYEAR2 = :cyear2', { cyear2: form.CYEAR2 })
            .andWhere('f.NRUNNO = :nrunno', { nrunno: form.NRUNNO })
            .andWhere('(f.VAPVNO = :vapvno OR f.VREPNO = :vap)', {
                vap: form.EMPNO,
                vapvno: form.EMPNO,
            })
            .andWhere('f.CSTEPST = :step', { step: this.STEP_READY })
            .getMany();
    }

    async checkReturn(form: empnoFormDto) {
        return await this.manager
            .getRepository(FLOW)
            .createQueryBuilder('f')
            .where('f.NFRMNO = :nfrmno', { nfrmno: form.NFRMNO })
            .andWhere('f.VORGNO = :vorgno', { vorgno: form.VORGNO })
            .andWhere('f.CYEAR = :cyear', { cyear: form.CYEAR })
            .andWhere('f.CYEAR2 = :cyear2', { cyear2: form.CYEAR2 })
            .andWhere('f.NRUNNO = :nrunno', { nrunno: form.NRUNNO })
            .andWhere('(f.VAPVNO = :vapvno OR f.VREPNO = :vap)', {
                vap: form.EMPNO,
                vapvno: form.EMPNO,
            })
            .andWhere("f.CSTEPNO = '--'")
            .andWhere('f.CSTEPST = :step', { step: this.STEP_READY })
            .getMany();
    }

    async checkReturnb(dto: empnoFormDto) {
        const flow = await this.getEmpFlowStepReady(dto);
        if (flow.length === 0) {
            return [];
        }
        const cstep = flow[0].CSTEPNEXTNO;
       return await this.manager.getRepository(FLOW)
            .createQueryBuilder('f')
            .where('f.NFRMNO = :nfrmno', { nfrmno: dto.NFRMNO })
            .andWhere('f.VORGNO = :vorgno', { vorgno: dto.VORGNO })
            .andWhere('f.CYEAR = :cyear', { cyear: dto.CYEAR })
            .andWhere('f.CYEAR2 = :cyear2', { cyear2: dto.CYEAR2 })
            .andWhere('f.NRUNNO = :nrunno', { nrunno: dto.NRUNNO })
            .andWhere('f.CSTEPNO = :step', { step: cstep })
            .andWhere('VREMOTE IS NOT NULL')
            .getMany();
    }

    async doactionUpdateFlow(flow: any, params: any) {
        // UPDATE APPROVAL STATUS
        let apvClause: string = '';
        params.stepNo = flow.CSTEPNO;
        if (
            flow.CAPVTYPE == this.APV_TYPE_SINGLE &&
            flow.CAPPLYALL == this.APPLY_ALL_NONE
        ) {
            apvClause = `and CSTEPNO = :stepNo`;
        } else if (
            flow.CAPVTYPE == this.APV_TYPE_SINGLE &&
            (flow.CAPPLYALL == this.APPLY_ALL_APV ||
                flow.CAPPLYALL == this.APPLY_ALL_REJ ||
                flow.CAPPLYALL == this.APPLY_ALL_BOTH)
        ) {
            apvClause = `and (CSTEPNO = :stepNo or (VAPVNO = :apv1 or VREPNO = :rep1))`;
            params = {
                ...params,
                apv1: params.VREALAPV,
                rep1: params.VREALAPV,
            };
        } else if (
            flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO &&
            flow.CAPPLYALL == this.APPLY_ALL_NONE
        ) {
            apvClause = `and ((VAPVNO = :apv1 or VREPNO = :rep1) and CSTEPNO = :stepNo)`;
            params = {
                ...params,
                apv1: params.VREALAPV,
                rep1: params.VREALAPV,
            };
        } else if (
            flow.CAPVTYPE == this.APV_TYPE_MULTIPLE_CO &&
            (flow.CAPPLYALL == this.APPLY_ALL_APV ||
                flow.CAPPLYALL == this.APPLY_ALL_BOTH)
        ) {
            apvClause = `and ((VAPVNO = :apv1 or VREPNO = :rep1) or (CSTEPNO = :stepNo and (VAPVNO = :apv2 or VREPNO = :rep2)))`;
            params = {
                ...params,
                apv1: params.VREALAPV,
                rep1: params.VREALAPV,
                apv2: params.VREALAPV,
                rep2: params.VREALAPV,
            };
        }
        const sql = `UPDATE FLOW SET CAPVSTNO = :whatAction, CSTEPST = :stepAction, DAPVDATE = TO_DATE(:DAPVDATE, 'YYYY-MM-DD'), CAPVTIME = :CAPVTIME, VREMARK = :VREMARK, VREMOTE = :VREMOTE, VREALAPV = :VREALAPV WHERE NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO AND CAPVSTNO = :CAPVSTNO ${apvClause}`;
        return this.manager.query(sql, params);
    }

    async updateStepNextStatus(form: FormDto, stepNext: string) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNO: stepNext,
                CSTEPST: In([this.STEP_NORMAL, this.STEP_WAIT]),
            },
            {
                CAPVSTNO: this.APV_NONE,
                CSTEPST: this.STEP_READY,
            },
        );
        // const sql =
        //     'update flow set CAPVSTNO = :apvNone, CSTEPST = :stepReady where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO AND CSTEPNO = :stepNext AND CSTEPST in (:stepNormal, :stepWait) ';
        // const params = {
        //     ...form,
        //     apvNone: this.APV_NONE,
        //     stepReady: this.STEP_READY,
        //     stepNext: stepNext,
        //     stepNormal: this.STEP_NORMAL,
        //     stepWait: this.STEP_WAIT,
        // };
        // return await this.execSql(sql, params);
    }

    async getStepNextNo(
        form: FormDto,
        {
            cextdata,
            step,
            start,
        }: { cextdata?: string; step?: string; start?: string },
    ) {
        const where = {
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
        };
        if (start == '1') {
            where['CSTART'] = start;
        } else if (step) {
            where['CSTEPNO'] = step;
        } else if (cextdata) {
            where['CEXTDATA'] = cextdata;
        }
        return await this.getRepository(FLOW).findOne({
            select: {
                CSTEPNEXTNO: true,
            },
            where,
        });
    }

    async checkedStep(form: FormDto, step: string) {
        const stepNextNo = await this.getStepNextNo(form, { step });
        return await this.getRepository(FLOW).find({
            where: {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNO: stepNextNo.CSTEPNEXTNO,
                CSTEPST: this.STEP_WAIT,
                CAPVSTNO: this.APV_NONE,
            },
        });
    }

    async updateNextStepWait(form: FormDto, stepNext: string) {
        const stepNextNo = await this.getStepNextNo(form, { step: stepNext });
        if ((await this.checkedStep(form, stepNext)) == null) {
            return;
        }
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNO: stepNextNo.CSTEPNEXTNO,
                CSTEPST: this.STEP_NORMAL,
                CAPVSTNO: this.APV_NONE,
            },
            {
                CAPVSTNO: this.APV_NONE,
                CSTEPST: this.STEP_WAIT,
            },
        );

        // const check = await this.manager.query(
        //     'select * from flow where NFRMNO = :1 AND VORGNO = :2 AND CYEAR = :3 AND CYEAR2 = :4 AND NRUNNO = :5 and CSTEPNO in (select cStepNextNo from flow where NFRMNO = :6 AND VORGNO = :7 AND CYEAR = :8 AND CYEAR2 = :9 AND NRUNNO = :10 and CSTEPNO = :11) and CSTEPST = :12 and CAPVSTNO = :13',
        //     [
        //         form.NFRMNO,
        //         form.VORGNO,
        //         form.CYEAR,
        //         form.CYEAR2,
        //         form.NRUNNO,
        //         form.NFRMNO,
        //         form.VORGNO,
        //         form.CYEAR,
        //         form.CYEAR2,
        //         form.NRUNNO,
        //         stepNext,
        //         this.STEP_NORMAL,
        //         this.APV_NONE,
        //     ],
        // );
        // if (check.length == 0) {
        //     return;
        // }
        // const sql =
        //     'update flow set CAPVSTNO = :apvNone, CSTEPST = :stepWait where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO in (select cStepNextNo from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CSTEPNO = :stepNext) and CSTEPST = :stepNormal and CAPVSTNO = :apvNone2';
        // const params = {
        //     ...form,
        //     frm: form.NFRMNO,
        //     org: form.VORGNO,
        //     y: form.CYEAR,
        //     y2: form.CYEAR2,
        //     runno: form.NRUNNO,
        //     apvNone: this.APV_NONE,
        //     apvNone2: this.APV_NONE,
        //     stepWait: this.STEP_WAIT,
        //     stepNormal: this.STEP_NORMAL,
        //     stepNext: stepNext,
        // };
        // return await this.execSql(sql, params);
    }

    async updateSingleStep(form: FormDto) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CAPVSTNO: this.APV_NONE,
                CSTEPST: In([
                    this.STEP_NORMAL,
                    this.STEP_WAIT,
                    this.STEP_READY,
                ]),
            },
            { CAPVSTNO: this.APV_REJECT, CSTEPST: this.STEP_SKIP },
        );

        // const sql =
        //     'update flow set CAPVSTNO = :apvReject, CSTEPST = :stepSkip where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CAPVSTNO = :apvNone and CSTEPST in (:stepNormal, :stepWait, :stepReady)';
        // const params = {
        //     ...form,
        //     apvReject: this.APV_REJECT,
        //     stepSkip: this.STEP_SKIP,
        //     apvNone: this.APV_NONE,
        //     stepNormal: this.STEP_NORMAL,
        //     stepWait: this.STEP_WAIT,
        //     stepReady: this.STEP_READY,
        // };
        // return await this.execSql(sql, params);
    }

    async updateStepWaitToNormal(form: FormDto) {
        const stepWait = this.getFlow({ ...form, CSTEPST: this.STEP_WAIT });
        if ((await stepWait).length == 0) {
            return;
        }
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPST: this.STEP_WAIT,
            },
            {
                CSTEPST: this.STEP_NORMAL,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        //    const stepWait = this.getFlow(
        //     { ...form, CSTEPST: this.STEP_WAIT },
        // );
        // if ((await stepWait).length == 0) {
        //     return;
        // }
        // const sql =
        //     "update flow set CSTEPST = :stepNormal, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPST = :stepWait ";
        // const params = {
        //     ...form,
        //     stepNormal: this.STEP_NORMAL,
        //     apvNone: this.APV_NONE,
        //     stepWait: this.STEP_WAIT,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Wait To Step Normal',
        // );
    }

    async updateStepReadyToWait(form: FormDto) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPST: this.STEP_READY,
            },
            {
                CSTEPST: this.STEP_WAIT,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "update flow set CSTEPST = :stepWait, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPST = :stepReady ";
        // const params = {
        //     ...form,
        //     stepWait: this.STEP_WAIT,
        //     apvNone: this.APV_NONE,
        //     stepReady: this.STEP_READY,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Ready To Step Wait',
        // );
    }

    async updateStepReqToReady(form: FormDto) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTART: '1',
            },
            {
                CSTEPST: this.STEP_READY,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cStart = '1' ";
        // const params = {
        //     ...form,
        //     stepReady: this.STEP_READY,
        //     apvNone: this.APV_NONE,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Request To Step Ready',
        // );
    }

    async updateAllStepToNormal(form: FormDto) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTART: Not('1'),
            },
            {
                CSTEPST: this.STEP_NORMAL,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "update flow set CSTEPST = :stepNormal, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cStart <> '1' ";
        // const params = {
        //     ...form,
        //     stepNormal: this.STEP_NORMAL,
        //     apvNone: this.APV_NONE,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update All Step To Step Normal',
        // );
    }

    async updateStepReqNextToWait(form: FormDto) {
        const stepno = await this.getStepNextNo(form, { start: '1' });
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNO: stepno.CSTEPNEXTNO,
            },
            {
                CSTEPST: this.STEP_WAIT,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );

        // const sql =
        //     "update flow set CSTEPST = :stepWait, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO = (select CSTEPNEXTNO from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CSTART = '1')";
        // const params = {
        //     ...form,
        //     frm: form.NFRMNO,
        //     org: form.VORGNO,
        //     y: form.CYEAR,
        //     y2: form.CYEAR2,
        //     runno: form.NRUNNO,
        //     stepWait: this.STEP_WAIT,
        //     apvNone: this.APV_NONE,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Request Next To Step Wait',
        // );
    }

    async getStepNoWait(form: FormDto) {
        return await this.getRepository(FLOW).findOne({
            select: {
                CSTEPNO: true,
            },
            where: {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPST: this.STEP_WAIT,
            },
        });
    }

    async updateStepReqToReadyB(form: FormDto) {
        const stepno = await this.getStepNoWait(form);
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNEXTNO: stepno.CSTEPNO,
            },
            {
                CSTEPST: this.STEP_READY,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and cstepnextno in (select cstepno from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and cstepst = :stepWait)";
        // const params = {
        //     ...form,
        //     frm: form.NFRMNO,
        //     org: form.VORGNO,
        //     y: form.CYEAR,
        //     y2: form.CYEAR2,
        //     runno: form.NRUNNO,
        //     stepReady: this.STEP_READY,
        //     apvNone: this.APV_NONE,
        //     stepWait: this.STEP_WAIT,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Request To Step Ready(Returnb)',
        // );
    }

    async updateStepNextExeToNormal(form: FormDto, cextdata: string) {
        const sql = `
            UPDATE FLOW f 
            SET f.CSTEPST = :stepNormal, f.VREALAPV = '', f.CAPVSTNO = :apvNone, f.DAPVDATE = '', f.CAPVTIME = '' 
            WHERE (f.NFRMNO, f.VORGNO, f.CYEAR, f.CYEAR2, f.NRUNNO, f.CSTEPNO, f.CEXTDATA) 
            IN (
                SELECT NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, CSTEPNO, CEXTDATA 
                FROM FLOW 
                START WITH  
                    CEXTDATA = :cextdata AND NFRMNO = :NFRMNO 
                    AND VORGNO = :VORGNO AND CYEAR = :CYEAR 
                    AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO 
                CONNECT BY 
                    NFRMNO = PRIOR NFRMNO 
                    AND VORGNO = PRIOR VORGNO 
                    AND CYEAR = PRIOR CYEAR 
                    AND CYEAR2 = PRIOR CYEAR2 
                    AND NRUNNO = PRIOR NRUNNO 
                    AND CSTEPNO = PRIOR CSTEPNEXTNO
            )`;
        const params = {
            ...form,
            cextdata: cextdata,
            stepNormal: this.STEP_NORMAL,
            apvNone: this.APV_NONE,
        };

        return await this.execSql(sql, params);
    }

    async updateStepExeToReady(form: FormDto, cextdata: string) {
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CEXTDATA: cextdata,
            },
            {
                CSTEPST: this.STEP_READY,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "update flow set CSTEPST = :stepReady, VREALAPV = '' , CAPVSTNO = :apvNone, DAPVDATE = '' , CAPVTIME = '' where NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CEXTDATA = :cextdata";

        // const params = {
        //     ...form,
        //     cextdata: cextdata,
        //     stepReady: this.STEP_READY,
        //     apvNone: this.APV_NONE,
        // };

        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Exedata To Step Ready(ReturnE)',
        // );
    }

    async updateStepNextExeToWait(form: FormDto, cextdata: string) {
        const stepno = await this.getStepNextNo(form, { cextdata });
        return await this.getRepository(FLOW).update(
            {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                CSTEPNO: stepno.CSTEPNEXTNO,
            },
            {
                CSTEPST: this.STEP_WAIT,
                VREALAPV: '',
                CAPVSTNO: this.APV_NONE,
                DAPVDATE: null,
                CAPVTIME: '',
            },
        );
        // const sql =
        //     "UPDATE FLOW f SET f.CSTEPST = :stepWait, f.VREALAPV = '', f.CAPVSTNO = :apvNone, f.DAPVDATE = '', f.CAPVTIME = '' WHERE NFRMNO = :NFRMNO AND VORGNO = :VORGNO AND CYEAR = :CYEAR AND CYEAR2 = :CYEAR2 AND NRUNNO = :NRUNNO and CSTEPNO = (select CSTEPNEXTNO from flow where NFRMNO = :frm AND VORGNO = :org AND CYEAR = :y AND CYEAR2 = :y2 AND NRUNNO = :runno and CEXTDATA = :cextdata)";
        // const params = {
        //     ...form,
        //     frm: form.NFRMNO,
        //     org: form.VORGNO,
        //     y: form.CYEAR,
        //     y2: form.CYEAR2,
        //     runno: form.NRUNNO,
        //     cextdata: cextdata,
        //     stepWait: this.STEP_WAIT,
        //     apvNone: this.APV_NONE,
        // };
        // return await this.execSql(
        //     sql,
        //     params,
        //     'Update Step Next Exe To Step Wait',
        // );
    }

    async execSql(sql: string, params: any) {
        return await this.manager.query(sql, params);
    }
}
