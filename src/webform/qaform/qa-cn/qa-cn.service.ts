import { Injectable } from '@nestjs/common';
import { CreateQaCnDto } from './dto/create-qa-cn.dto';
import { UpdateQaCnDto } from './dto/update-qa-cn.dto';
import { In } from 'typeorm';

import { RequestCNFormDto } from './dto/request-qa-cn.dto';
import { ApproveQaCnDto } from './dto/approve-qa-cn.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { OrgposRepository } from 'src/webform/orgpos/orgpos.repository';
import { CnFormRepository } from './cnform/cnform.repository';
import { ResultChkDwgRepository } from './resultchkdwg/resultchkdwg.repository';
import { AttcnfrmService } from './attcnfrm/attcnfrm.service';
import { AttCnFrmRepository } from './attcnfrm/attcnfrm.repository';
import { HpoService } from 'src/as400/bpcsfvnew/hpo/hpo.service';
import { J736kpService } from 'src/as400/rtnlibf/j736kp/j736kp.service';
import { now } from 'src/common/utils/dayjs.utils';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { log } from 'node:console';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { R027Mp1Service } from 'src/as400/datalibo/r027mp1/r027mp1.service';
import { FormService } from 'src/webform/form/form.service';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class QaCnService {
    constructor(
        private readonly formCreateService: FormCreateService,
        private readonly flowService: FlowService,
        private readonly repoOrgPos: OrgposRepository,
        private readonly repoCnform: CnFormRepository,
        private readonly formService: FormService,
        private readonly repoDwg: ResultChkDwgRepository,
        private readonly attcnfrmService: AttcnfrmService,
        private readonly attcnfrmrepo: AttCnFrmRepository,
        private readonly hpoService: HpoService,
        private readonly j736kpService: J736kpService,
        private readonly doactionService: DoactionFlowService,
        private readonly deleteflowService: DeleteFlowStepService,
        private readonly r027Mp1Service: R027Mp1Service,
        private readonly mailService: MailService,
    ) {}

    async request(
        dto: RequestCNFormDto,
        files: {
            'DWGFILE[]'?: Express.Multer.File[];
            'MATFILE[]'?: Express.Multer.File[];
            'MAKFILE[]'?: Express.Multer.File[];
            'ROHFILE[]'?: Express.Multer.File[];
            'PURFILE[]'?: Express.Multer.File[];
            'SUBFILE[]'?: Express.Multer.File[];
            'CHKFILE[]'?: Express.Multer.File[];
            'JUDFILE[]'?: Express.Multer.File[];
        }, // <--- เปลี่ยนตรงนี้
        ip: string,
        path: string,
    ) {
        try {
            const { REQBY, INPUTBY, REMARK, ACTION, DWGNO, ...cndata } = dto;
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: cndata.NFRMNO,
                    VORGNO: cndata.VORGNO,
                    CYEAR: cndata.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(ACTION === 'save' && { DRAFT: '0' }),
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const currentForm = {
                NFRMNO: cndata.NFRMNO,
                VORGNO: cndata.VORGNO,
                CYEAR: cndata.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            let condition: any;
            let rsapv;
            //manage flow
            if (cndata.RADSEC == '1') {
                //เจาะจงแผนก
                if (cndata.SEC == '1' || cndata.SEC == '2') {
                    if (cndata.SEC == '1') {
                        condition = {
                            VORGNO: '000502',
                            VPOSNO: '30',
                        };
                    } else {
                        condition = {
                            VORGNO: '000502',
                            VPOSNO: '30',
                        };
                    }
                    rsapv = await this.repoOrgPos.getOrgPos(condition);
                    condition = {
                        ...currentForm,
                        CEXTDATA: In(['01', '04']),
                    };
                    await this.flowService.updateFlow({
                        condition: condition,
                        VAPVNO: rsapv[0].VEMPNO,
                    });
                    // condition = {
                    //     ...currentForm,
                    //     CSTEPNO: In(['07', '61']),
                    // };
                    //await this.flowService.deleteFlow(condition);
                    condition = {
                        ...currentForm,
                        CSTEPNO: '07',
                    };
                    await this.deleteflowService.deleteFlowStep(condition);
                    condition.CSTEPNO = '61';
                    await this.deleteflowService.deleteFlowStep(condition);
                } else if (cndata.SEC == '3') {
                    condition = {
                        ...currentForm,
                        CEXTDATA: '01',
                    };
                    await this.flowService.updateFlow({
                        condition: condition,
                        VAPVNO: '16063',
                    });
                    condition = {
                        VORGNO: '000404',
                        VPOSNO: '30',
                    };
                    rsapv = await this.repoOrgPos.getOrgPos(condition);
                    condition = {
                        ...currentForm,
                        CEXTDATA: '04',
                    };
                    await this.flowService.updateFlow({
                        condition: condition,
                        VAPVNO: rsapv[0].VEMPNO,
                    });
                    condition = {
                        VORGNO: '000401',
                        VPOSNO: '20',
                    };
                    rsapv = await this.repoOrgPos.getOrgPos(condition);
                    condition = {
                        ...currentForm,
                        CEXTDATA: '05',
                    };
                    await this.flowService.updateFlow({
                        condition: condition,
                        VAPVNO: rsapv[0].VEMPNO,
                    });
                }
            } else {
                //ไม่เจาะจงแผนก
                let inc = await this.repoCnform.findInc(
                    Number(cndata.ITEMNO.charAt(0)),
                );
                console.log('>>>>>INC<<<<<');
                console.log(inc);
                console.log('>>>>>INC<<<<<');

                if (inc) {
                    const items = [
                        '630',
                        '631',
                        '632',
                        '633',
                        '636',
                        '640',
                        '644',
                        '645',
                        '649',
                        '656',
                        '362',
                        '364',
                        '366',
                        '367',
                        '368',
                    ];
                    if (items.includes(dto.ITEMNO.substring(0, 3))) {
                        condition = {
                            VORGNO: '000502',
                            VPOSNO: '30',
                        };
                        rsapv = await this.repoOrgPos.getOrgPos(condition);
                        inc = rsapv[0].VEMPNO;
                    }
                    condition = {
                        ...currentForm,
                        CEXTDATA: In(['01', '04']),
                    };
                    await this.flowService.updateFlow({
                        condition: condition,
                        VAPVNO: inc,
                    });
                    console.log('>>>>>update<<<<<');
                    console.log(condition);
                    console.log('>>>>>update<<<<<');
                }

                if (cndata.RADPROCAMEC == '2') {
                    if (cndata.RADOBJ == '2' || cndata.RADOBJ == '3') {
                        condition = {
                            ...currentForm,
                            CEXTDATA: '01',
                        };
                        await this.flowService.updateFlow({
                            condition: condition,
                            VAPVNO: '16063',
                        });
                        condition = {
                            VORGNO: '000404',
                            VPOSNO: '30',
                        };
                        rsapv = await this.repoOrgPos.getOrgPos(condition);
                        condition = {
                            ...currentForm,
                            CEXTDATA: '04',
                        };
                        await this.flowService.updateFlow({
                            condition: condition,
                            VAPVNO: rsapv[0].VEMPNO,
                        });
                        condition = {
                            VORGNO: '000401',
                            VPOSNO: '20',
                        };
                        rsapv = await this.repoOrgPos.getOrgPos(condition);
                        condition = {
                            ...currentForm,
                            CEXTDATA: '05',
                        };
                        await this.flowService.updateFlow({
                            condition: condition,
                            VAPVNO: rsapv[0].VEMPNO,
                        });
                    }
                }
                const rsqic = await this.flowService.getFlow({
                    ...currentForm,
                    VAPVNO: '05030',
                });
                if (rsqic.length == 0) {
                    // condition = {
                    //     ...currentForm,
                    //     CSTEPNO: In(['07', '61']),
                    // };

                    // await this.flowService.deleteFlow(condition);
                    condition = {
                        ...currentForm,
                        CSTEPNO: '07',
                    };
                    await this.deleteflowService.deleteFlowStep(condition);
                    condition.CSTEPNO = '61';
                    await this.deleteflowService.deleteFlowStep(condition);
                }
            }
            await this.repoCnform.insert({
                ...currentForm,
                ...cndata,
            });
            const dwgToInsert = DWGNO.map((item) => {
                return {
                    // ใช้ค่าจาก FormDto เป็นหัวขบวน
                    ...currentForm,
                    ...item,
                };
            });
            await this.repoDwg.insertMultiple(dwgToInsert);
            const fileMappings = [
                { key: 'DWGFILE[]', TYPENO: 0 },
                { key: 'MATFILE[]', TYPENO: 1 },
                { key: 'MAKFILE[]', TYPENO: 2 },
                { key: 'ROHFILE[]', TYPENO: 3 },
                { key: 'PURFILE[]', TYPENO: 4 },
                { key: 'CHKFILE[]', TYPENO: 6 },
                { key: 'JUDFILE[]', TYPENO: 7 },
                { key: 'SUBFILE[]', TYPENO: 8 },
            ];
            for (const mapping of fileMappings) {
                const currentFiles = files[mapping.key];
                if (currentFiles && currentFiles.length > 0) {
                    await this.attcnfrmService.moveAndInsertFiles({
                        files: currentFiles,
                        form: currentForm,
                        path: path,
                        folder:
                            currentForm.NFRMNO +
                            '_' +
                            currentForm.VORGNO +
                            '_' +
                            currentForm.CYEAR +
                            '_' +
                            currentForm.CYEAR2 +
                            '_' +
                            currentForm.NRUNNO,
                        typeno: mapping.TYPENO,
                        requestedBy: REQBY, // เปลี่ยนเป็นตัวแปรที่เก็บผู้ขอ/ผู้อัปโหลดใน dto ของคุณ
                    });
                }
            }
            return {
                status: true,
                message: 'Request QA-CN Form successful',
            };
        } catch (error) {
            throw new Error('Request QA-CN Form Error: ' + error.message);
        }
    }
    async approve(
        dto: ApproveQaCnDto,
        files: {
            'DWGFILE[]'?: Express.Multer.File[];
            'MATFILE[]'?: Express.Multer.File[];
            'MAKFILE[]'?: Express.Multer.File[];
            'ROHFILE[]'?: Express.Multer.File[];
            'PURFILE[]'?: Express.Multer.File[];
            'SUBFILE[]'?: Express.Multer.File[];
            'CHKFILE[]'?: Express.Multer.File[];
            'JUDFILE[]'?: Express.Multer.File[];
        },
        ip: string,
        path: string,
    ) {
        let condition: any;
        const fileMappings = [
            { key: 'DWGFILE[]', TYPENO: 0 },
            { key: 'MATFILE[]', TYPENO: 1 },
            { key: 'MAKFILE[]', TYPENO: 2 },
            { key: 'ROHFILE[]', TYPENO: 3 },
            { key: 'PURFILE[]', TYPENO: 4 },
            { key: 'CHKFILE[]', TYPENO: 6 },
            { key: 'JUDFILE[]', TYPENO: 7 },
            { key: 'SUBFILE[]', TYPENO: 8 },
        ];
        try {
            const {
                APVNO,
                CEXTDATA,
                STEPREADY,
                SELJINCHRG,
                SELEINCHRG,
                OPERATOR,
                SELJOBTYPE,
                REMARK,
                ACTION,
                DWGNO,
                MSTATUS,
                ...cndata
            } = dto;
            const currentForm = {
                NFRMNO: cndata.NFRMNO,
                VORGNO: cndata.VORGNO,
                CYEAR: cndata.CYEAR,
                CYEAR2: cndata.CYEAR2,
                NRUNNO: cndata.NRUNNO,
            };
            // console.log('============' + REMARK);

            if (ACTION == 'approve' || ACTION == 'reject') {
                let act;
                if (CEXTDATA > 1 && CEXTDATA != 5 && ACTION == 'reject') {
                    act = 'approve';
                } else {
                    act = ACTION;
                }
                const confirm = await this.doactionService.doAction(
                    {
                        ...currentForm,
                        ACTION: act,
                        EMPNO: APVNO,
                        REMARK: REMARK,
                    },
                    ip,
                );
                if (confirm.status) {
                    await this.processApprovalActions(
                        dto,
                        currentForm,
                        files,
                        path,
                        fileMappings,
                    );
                    const formStatus =
                        await this.formCreateService.getFormStatus({
                            ...currentForm,
                        });
                    if (formStatus == '2' || formStatus == '3') {
                        if (formStatus == '3' && MSTATUS == '1') {
                            await this.createcnng(currentForm, ip);
                        }
                        let mstatus = MSTATUS == '1' ? 'PIC' : 'ALL';
                        const toEmail = (
                            await this.repoCnform.getApvEmail(
                                currentForm,
                                mstatus,
                            )
                        ).map((item) => item.EMAIL);
                        await this.buildmail(
                            currentForm,
                            mstatus,
                            formStatus,
                            toEmail,
                        );
                    } else if (STEPREADY == '06' && MSTATUS == '1') {
                        const toEmail = (
                            await this.repoCnform.getApvEmail(
                                currentForm,
                                'FOREMAN',
                            )
                        ).map((item) => item.EMAIL);
                        await this.buildmail(
                            currentForm,
                            'FOREMAN',
                            formStatus,
                            toEmail,
                        );
                    }
                }
            } else if (ACTION == 'sendApv') {
                if (STEPREADY == '--') {
                    const confirm = await this.doactionService.doAction(
                        {
                            ...currentForm,
                            ACTION: 'approve',
                            EMPNO: APVNO,
                            REMARK: REMARK,
                        },
                        ip,
                    );
                }
                await this.processApprovalActions(
                    dto,
                    currentForm,
                    files,
                    path,
                    fileMappings,
                );
            } else if (ACTION == 'returnb') {
                const confirm = await this.doactionService.doAction(
                    {
                        ...currentForm,
                        ACTION: ACTION,
                        EMPNO: APVNO,
                        REMARK: REMARK,
                    },
                    ip,
                );
            } else {
                await this.processApprovalActions(
                    dto,
                    currentForm,
                    files,
                    path,
                    fileMappings,
                );
                if (ACTION == 'return') {
                    const confirm = await this.doactionService.doAction(
                        {
                            ...currentForm,
                            ACTION: ACTION,
                            EMPNO: APVNO,
                            REMARK: REMARK,
                        },
                        ip,
                    );
                    if (confirm.status) {
                        const toEmail = (
                            await this.repoCnform.getApvEmail(
                                currentForm,
                                'REQUESTER',
                            )
                        ).map((item) => item.EMAIL);

                        await this.buildmail(
                            currentForm,
                            'REQUESTER',
                            '1',
                            toEmail,
                        );
                    }
                } else if (ACTION == 'returnqastaff') {
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CSTEPST: '2',
                        },
                        CSTEPST: '1',
                    });
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CSTEPST: '3',
                        },
                        CSTEPST: '2',
                        VREMARK: REMARK,
                    });
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CEXTDATA: '03',
                        },
                        CSTEPST: '3',
                        CAPVSTNO: '',
                        DAPVDATE: null,
                        CAPVTIME: '',
                    });
                } else if (ACTION == 'returnass') {
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CSTEPST: '2',
                        },
                        CSTEPST: '1',
                    });
                    console.log('Remark ===' + REMARK);
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CSTEPST: '3',
                        },
                        CSTEPST: '2',
                        VREMARK: REMARK,
                    });
                    await this.flowService.updateFlow({
                        condition: {
                            ...currentForm,
                            CEXTDATA: '02',
                        },
                        CSTEPST: '3',
                        CAPVSTNO: '',
                        DAPVDATE: null,
                        CAPVTIME: '',
                    });
                }
            }

            return {
                status: true,
                message: 'Approve QA-CN Form successful',
            };
        } catch (error) {
            throw new Error('Approve QA-CN Form Error: ' + error.message);
        }
    }

    create(createQaCnDto: CreateQaCnDto) {
        return 'This action adds a new qaCn';
    }

    findAll() {
        return `This action returns all qaCn`;
    }

    findOne(id: number) {
        return `This action returns a #${id} qaCn`;
    }

    update(id: number, updateQaCnDto: UpdateQaCnDto) {
        return `This action updates a #${id} qaCn`;
    }

    remove(id: number) {
        return `This action removes a #${id} qaCn`;
    }

    private async createcnng(dto: FormDto, ip: string) {
        try {
            console.log('creangffffffffffffff');

            const res = await this.repoCnform.getFirstNo(dto);
            console.log('rrrrrrrrrrrrrrrrr');
            console.log(res);
            console.log('rrrrrrrrrrrrrrrrr');

            let newcnng: any[] = [];
            if (res && res.FIRSTNO) {
                newcnng = await this.r027Mp1Service.getnewcn(res.FIRSTNO);
                console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA');
                console.log(newcnng);
                console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA');
                if (newcnng && newcnng[0].R27M09) {
                    await this.r027Mp1Service.insertNewCn(
                        newcnng[0].R27M09,
                        res.FIRSTNO,
                    );
                }
            }
            const cnform = await this.formService.getFormData(dto);
            const datacnfrm = await this.repoCnform.findByCondition(dto);
            console.log('ccccccccccccccccccccccccccccc');
            console.log(cnform);
            console.log('ccccccccccccccccccccccccccccc');
            const cnformnew = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                REQBY: cnform.VREQNO,
                INPUTBY: cnform.VINPUTER,
                REMARK: '',
            };
            const rsf = await this.formCreateService.create(
                { ...cnformnew },
                ip,
            );
            if (rsf.status) {
                let condition: any = {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    CYEAR2: rsf.data.CYEAR2,
                    NRUNNO: rsf.data.NRUNNO,
                    CSTEPNO: '04',
                };
                await this.deleteflowService.deleteFlowStep(condition);
                condition.CSTEPNO = '19';
                await this.deleteflowService.deleteFlowStep(condition);
                condition.CSTEPNO = '26';
                await this.deleteflowService.deleteFlowStep(condition);
                condition.CSTEPNO = '10';
                await this.deleteflowService.deleteFlowStep(condition);
                condition.CSTEPNO = '11';
                await this.deleteflowService.deleteFlowStep(condition);
                if (cnform) {
                    const datacn = {
                        NFRMNO: dto.NFRMNO,
                        VORGNO: dto.VORGNO,
                        CYEAR: dto.CYEAR,
                        CYEAR2: rsf.data.CYEAR2,
                        NRUNNO: rsf.data.NRUNNO,
                        TITLE: datacnfrm[0].TITLE,
                        SVENDNAME: datacnfrm[0].SVENDNAME,
                        CLSNO: datacnfrm[0].CLSNO,
                        RSNNO: datacnfrm[0].RSNNO,
                        RSNOTHER: '1 st No.,' + newcnng[0].R27M09,
                        TRANSNO: datacnfrm[0].TRANSNO,
                        DETTRANS: datacnfrm[0].DETTRANS,
                        PRTNAME: datacnfrm[0].PRTNAME,
                        PURITEM: datacnfrm[0].PURITEM,
                        INVNO: datacnfrm[0].INVNO,
                        ITEMNO: datacnfrm[0].ITEMNO,
                        ORDERNO: datacnfrm[0].ORDERNO,
                        ORDQ: datacnfrm[0].ORDQ,
                        PRTLOC: datacnfrm[0].PRTLOC,
                        PRDCTNAME: datacnfrm[0].PRDCTNAME,
                        AFTCHANGE: datacnfrm[0].AFTCHANGE,
                        MSTATUS: '1',
                    };
                    await this.repoCnform.insert(datacn);
                    const dwg = await this.repoDwg.findByCondition(dto);
                    let dwgToInsert: any[] = [];
                    if (dwg && dwg.length > 0) {
                        dwgToInsert = dwg.map((item) => {
                            return {
                                ...datacn,
                                DWGNO: item.DWGNO,
                                REVNO: item.REVNO,
                            };
                        });
                        await this.repoDwg.insertMultiple(dwgToInsert);
                    }
                    const cnflowpre = await this.flowService.getFlow({
                        ...dto,
                        CEXTDATA: '06',
                    });
                    if (cnflowpre && cnflowpre.length > 0) {
                        delete condition.CSTEPNO;
                        await this.flowService.updateFlow({
                            condition: {
                                ...condition,
                                CEXTDATA: In(['03', '06']),
                            },
                            VAPVNO: cnflowpre[0].VAPVNO,
                        });
                    }
                } else {
                    return {
                        status: 'error',
                        message: 'create cn ng false',
                    };
                }
            }

            return {
                status: 'success',
                message: 'create cn ng success',
            };
        } catch (error) {
            // ถ้า Insert ไม่สำเร็จ หรือพังในขั้นตอนใดๆ จะกระโดดมาที่นี่แทน
            console.error('เกิดข้อผิดพลาด หยุดการทำงาน:', error.message);

            return {
                status: 'error',
                message: 'create cn ng false',
            };
        }
    }

    private async buildmail(
        dto: FormDto,
        mtype: string,
        fstatus: string,
        to: string[],
    ) {
        const formno = await this.formCreateService.getFormno(dto);
        let type =
            mtype === 'FORMAN'
                ? 'FOREMAN'
                : mtype === 'PIC'
                  ? 'PIC'
                  : mtype === 'REQUESTER'
                    ? 'REQUESTER'
                    : 'ALL';
        console.log('>>>>>>>>>');
        console.log(to);
        console.log('>>>>>>>>>');

        let rs = await this.repoCnform.getQueryBuilderResult(dto);
        const first = rs?.[0] ?? null;
        let subject = '';
        let html = '';
        if (mtype == 'ALL') {
            subject =
                fstatus == '2'
                    ? `E-Form ${formno} was approved`
                    : fstatus == '3'
                      ? `E-Form ${formno} was rejected`
                      : '';
            if (first) {
                html = `
                <div>Changing notice no.: ${formno} </div>
<div>Supplier or Sub-contractor Name: ${first.SVENDNAME}</div>
<div>Part Name: ${first.PRTNAME}</div> `;
                for (const row of rs) {
                    html += `<div>Drawing No.: ${row.DWGNO}</dic>`;
                }
                html += `<div>Status: ${first.JUDGEMENT || ''}</div>`;
            } else {
                html = `<div>No data found</div>`;
            }
        } else if (mtype == 'FOREMAN') {
            subject = `E-Form ${formno}`;
            html = `<div>Changing notice no.: ${formno}</div>`;
            if (first) {
                if (first.FIRSTNO) {
                    html += `<div>First no.: ${first.FIRSTNO}</div>`;
                }
                html += `<div>Part Name: ${first.PRTNAME}</div>`;
                let i = 1;
                for (const row of rs) {
                    if (i == 1) {
                        html += `<div>Drawing No.: ${row.DWGNO}</div>`;
                    } else {
                        html += `<div>&nbsp;&nbsp;&nbsp;&nbsp; ${row.DWGNO}</div>`;
                    }
                    i++;
                }
            }
        } else if (mtype == 'PIC') {
            subject = `Result of ${formno}`;
            html = `<div>Changing notice no.: ${formno}</div>`;
            if (first) {
                if (first.FIRSTNO) {
                    html += `<div>First no.: ${first.FIRSTNO}</div>`;
                }
                html += `<div>Part Name: ${first.PRTNAME}</div>`;
                let i = 1;
                for (const row of rs) {
                    if (i == 1) {
                        html += `<div>Drawing No.: ${row.DWGNO}</div>`;
                    } else {
                        html += `<div>&nbsp;&nbsp;&nbsp;&nbsp; ${row.DWGNO}</div>`;
                    }
                    html += `<div>Status: ${row.RESULT === '0' ? "<font color='green'>OK</font>" : row.RESULT === '1' ? "<font color='red'>NG</font>" : ''}</div>`;
                    i++;
                }
            }
        } else if (mtype == 'REQUESTER') {
            subject = `E-Form ${formno} has been returned`;
            html = `<div>Changing notice no.: ${formno}</div>`;
            if (first) {
                if (first.FIRSTNO) {
                    html += `<div>First no.: ${first.FIRSTNO}</div>`;
                }
                html += `<div>Part Name: ${first.PRTNAME}</div>`;
                let i = 1;
                for (const row of rs) {
                    if (i == 1) {
                        html += `<div>Drawing No.: ${row.DWGNO}</div>`;
                    } else {
                        html += `<div>&nbsp;&nbsp;&nbsp;&nbsp; ${row.DWGNO}</div>`;
                    }
                    i++;
                }
            }
        }
        if (!to || !subject || !html) {
            throw new Error('Mail data is incomplete');
        }
        let objmail = {
            from: 'noreplay@MitsubishiElevatorAsia.co.th',
            to: to,
            subject: subject,
            html: html,
        };
        await this.mailService.sendMail(objmail);
    }

    private async processApprovalActions(
        dto: ApproveQaCnDto,
        currentForm: any,
        files: any,
        path: string,
        fileMappings: any[],
    ) {
        let condition: any;

        // Destructure ข้อมูลที่จำเป็นต้องใช้ในฟังก์ชันนี้
        const {
            APVNO,
            CEXTDATA,
            STEPREADY,
            SELJINCHRG,
            SELEINCHRG,
            OPERATOR,
            SELJOBTYPE,
            ACTION,
            DWGNO,
            REMARK,
            ...cndata
        } = dto;

        const dwgToInsert = (DWGNO || []).map((item) => {
            return {
                ...currentForm,
                ...item,
            };
        });

        if (SELJINCHRG) {
            condition = { ...currentForm, CEXTDATA: '02' };
            await this.flowService.updateFlow({
                condition: condition,
                VAPVNO: SELJINCHRG,
            });
        }
        if (SELEINCHRG) {
            condition = { ...currentForm, CEXTDATA: '03' };
            await this.flowService.updateFlow({
                condition: condition,
                VAPVNO: SELEINCHRG,
            });
        }
        if (OPERATOR) {
            condition = { ...currentForm, CEXTDATA: '07' };
            await this.flowService.updateFlow({
                condition: condition,
                VAPVNO: OPERATOR,
            });
        }
        if (SELJOBTYPE && SELJOBTYPE == 'S') {
            condition = { ...currentForm, CSTEPNO: '07' };
            await this.deleteflowService.deleteFlowStep(condition);
            condition.CSTEPNO = '61';
            await this.deleteflowService.deleteFlowStep(condition);
        }

        if (CEXTDATA >= 2 && CEXTDATA < 8) {
            await this.repoCnform.update(
                { ...currentForm },
                {
                    JDGMNTNO: cndata.RADJUDGE ? Number(cndata.RADJUDGE) : null,
                    JDGOTHER:
                        cndata.RADJUDGE?.toString() == '2.5'
                            ? cndata.TXTJDGOTHER1
                            : cndata.RADJUDGE?.toString() == '4.2'
                              ? cndata.TXTJDGOTHER2
                              : '',
                },
            );
            if (ACTION != 'return') {
                await this.repoDwg.deleteByAll(currentForm);
                await this.repoDwg.insertMultiple(dwgToInsert);
            }
        }

        if (ACTION == 'approve') {
            if (STEPREADY == '--') {
                await this.repoCnform.update({ ...currentForm }, { ...cndata });
                await this.repoDwg.deleteByAll(currentForm);
                await this.repoDwg.insertMultiple(dwgToInsert);
            }
            if (CEXTDATA == 8 && cndata.CLSNO == 2) {
                if (cndata.INVNO && cndata.INVNO.length >= 8) {
                    const pono = cndata.INVNO.substring(0, 8);
                    const isNumber = pono.trim() !== '' && !isNaN(Number(pono));
                    if (isNumber) {
                        const pord =
                            pono.toString().substring(0, 2) +
                            pono.toString().substring(4, 4);
                        const pprod = cndata.PURITEM;
                        const formno =
                            await this.formCreateService.getFormno(currentForm);
                        await this.hpoService.updateByOrderProd(
                            pord,
                            pprod,
                            formno,
                        );
                    }
                }
            } else if (CEXTDATA == 7) {
                const formno =
                    await this.formCreateService.getFormno(currentForm);
                await this.j736kpService.updateByFormno(formno);
            }
        } else if (ACTION == 'reject') {
            if (CEXTDATA == 7) {
                const formno =
                    await this.formCreateService.getFormno(currentForm);
                await this.j736kpService.updateByFormno(formno);
            }
            if (CEXTDATA > 1 && CEXTDATA != 5) {
                const updatedata = { CSTEPST: '6', CAPVSTNO: '2' };
                await Promise.all([
                    this.flowService
                        .updateFlow({
                            condition: { ...currentForm, VAPVNO: APVNO },
                            ...updatedata,
                        })
                        .catch(() => {}),
                    this.flowService
                        .updateFlow({
                            condition: { ...currentForm, VREPNO: APVNO },
                            ...updatedata,
                        })
                        .catch(() => {}),
                ]);
            }
        } else if (ACTION == 'sendApv' || ACTION == 'saveData') {
            // เนื่องจาก sendApv และ saveData โค้ดส่วนนี้เหมือนกันเป๊ะ สามารถรวบเงื่อนไขได้
            await this.repoCnform.update({ ...currentForm }, { ...cndata });
            await this.repoDwg.deleteByAll(currentForm);
            await this.repoDwg.insertMultiple(dwgToInsert);
            for (const mapping of fileMappings) {
                const currentFiles = files[mapping.key];
                if (currentFiles && currentFiles.length > 0) {
                    await this.attcnfrmService.moveAndInsertFiles({
                        files: currentFiles,
                        form: currentForm,
                        path: path,
                        folder: `${currentForm.NFRMNO}_${currentForm.VORGNO}_${currentForm.CYEAR}_${currentForm.CYEAR2}_${currentForm.NRUNNO}`,
                        typeno: mapping.TYPENO,
                        requestedBy: APVNO,
                    });
                }
            }
            // เฉพาะของ sendApv ที่มีอัปเดต flow และ form
            if (ACTION == 'sendApv') {
                if (STEPREADY != '--') {
                    await this.flowService.updateFlow({
                        condition: { ...currentForm, CSTEPNO: '--' },
                        DAPVDATE: new Date(),
                        CAPVTIME: now('HH:mm:ss'),
                    });
                }
                await this.formCreateService.updateForm({
                    condition: { ...currentForm },
                    CST: '1',
                });
            }
        } else if (ACTION == 'deleteApv') {
            const resfile = await this.attcnfrmrepo.getQaFileAll(currentForm);
            for (const f of resfile) {
                const destination = await joinPaths(
                    `${path}${currentForm.NFRMNO}_${currentForm.VORGNO}_${currentForm.CYEAR}_${currentForm.CYEAR2}_${currentForm.NRUNNO}`,
                    f.SFILE,
                );
                await deleteFile(destination);
            }
            await this.repoDwg.deleteByAll(currentForm);
            await this.attcnfrmrepo.deleteAll(currentForm);
            await this.repoCnform.deleteAll(currentForm);
            await this.formCreateService.deleteFlowAndForm(currentForm);
        } else if (ACTION == 'change') {
            await this.flowService.updateFlow({
                condition: { ...currentForm, CEXTDATA: In(['03', '06']) },
                VAPVNO: cndata.FOREMAN,
            });
        } else if (ACTION == 'changepic') {
            await this.flowService.updateFlow({
                condition: { ...currentForm, CEXTDATA: CEXTDATA },
                VAPVNO: cndata.PIC,
            });
        }
        if (ACTION != 'deleteApv') {
            for (const mapping of fileMappings) {
                const currentFiles = files[mapping.key];
                if (currentFiles && currentFiles.length > 0) {
                    await this.attcnfrmService.moveAndInsertFiles({
                        files: currentFiles,
                        form: currentForm,
                        path: path,
                        folder: `${currentForm.NFRMNO}_${currentForm.VORGNO}_${currentForm.CYEAR}_${currentForm.CYEAR2}_${currentForm.NRUNNO}`,
                        typeno: mapping.TYPENO,
                        requestedBy: APVNO,
                    });
                }
            }
        }
    }
}
