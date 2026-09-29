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

@Injectable()
export class QaCnService {
    constructor(
        private readonly formCreateService: FormCreateService,
        private readonly flowService: FlowService,
        private readonly repoOrgPos: OrgposRepository,
        private readonly repoCnform: CnFormRepository,
        private readonly repoDwg: ResultChkDwgRepository,
        private readonly attcnfrmService: AttcnfrmService,
        private readonly attcnfrmrepo: AttCnFrmRepository,
        private readonly hpoService: HpoService,
        private readonly j736kpService: J736kpService,
        private readonly doactionService: DoactionFlowService,
        private readonly deleteflowService: DeleteFlowStepService,
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
                ...cndata
            } = dto;
            const currentForm = {
                NFRMNO: cndata.NFRMNO,
                VORGNO: cndata.VORGNO,
                CYEAR: cndata.CYEAR,
                CYEAR2: cndata.CYEAR2,
                NRUNNO: cndata.NRUNNO,
            };
            const dwgToInsert = DWGNO.map((item) => {
                return {
                    // ใช้ค่าจาก FormDto เป็นหัวขบวน
                    ...currentForm,
                    ...item,
                };
            });
            if (SELJINCHRG) {
                condition = {
                    ...currentForm,
                    CEXTDATA: '02',
                };
                await this.flowService.updateFlow({
                    condition: condition,
                    VAPVNO: SELJINCHRG,
                });
            }
            if (SELEINCHRG) {
                condition = {
                    ...currentForm,
                    CEXTDATA: '03',
                };
                await this.flowService.updateFlow({
                    condition: condition,
                    VAPVNO: SELEINCHRG,
                });
            }
            if (OPERATOR) {
                condition = {
                    ...currentForm,
                    CEXTDATA: '07',
                };
                await this.flowService.updateFlow({
                    condition: condition,
                    VAPVNO: OPERATOR,
                });
            }
            if (SELJOBTYPE && SELJOBTYPE == 'S') {
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
            if (CEXTDATA >= 2 && CEXTDATA < 8) {
                await this.repoCnform.update(
                    { ...currentForm },
                    {
                        JDGMNTNO: cndata.RADJUDGE
                            ? Number(cndata.RADJUDGE)
                            : null,
                        JDGOTHER:
                            cndata.RADJUDGE.toString() == '2.5'
                                ? cndata.TXTJDGOTHER1
                                : cndata.RADJUDGE.toString() == '4.2'
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
                    await this.repoCnform.update(
                        { ...currentForm },
                        { ...cndata },
                    );
                    await this.repoDwg.deleteByAll(currentForm);
                    await this.repoDwg.insertMultiple(dwgToInsert);
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
                                requestedBy: APVNO, // เปลี่ยนเป็นตัวแปรที่เก็บผู้ขอ/ผู้อัปโหลดใน dto ของคุณ
                            });
                        }
                    }
                }
                if (CEXTDATA == 8 && cndata.CLSNO == 2) {
                    if (cndata.INVNO && cndata.INVNO.length >= 8) {
                        const pono = cndata.INVNO.substring(0, 8);
                        const isNumber =
                            pono.trim() !== '' && !isNaN(Number(pono));
                        if (isNumber) {
                            const pord =
                                pono.toString().substring(0, 2) +
                                pono.toString().substring(4, 4);
                            const pprod = cndata.PURITEM;
                            const formno =
                                await this.formCreateService.getFormno(
                                    currentForm,
                                );
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
                await this.doactionService.doAction(
                    {
                        ...currentForm,
                        ACTION: 'approve',
                        EMPNO: APVNO,
                        REMARK: REMARK,
                    },
                    ip,
                );
            } else if (ACTION == 'reject') {
                if (CEXTDATA == 7) {
                    const formno =
                        await this.formCreateService.getFormno(currentForm);
                    await this.j736kpService.updateByFormno(formno);
                }
                if (CEXTDATA > 1 && CEXTDATA != 5) {
                    const updatedata = {
                        CSTEPST: '6',
                        CAPVSTNO: '2',
                    };
                    await Promise.all([
                        // เงื่อนไขที่ 1
                        this.flowService
                            .updateFlow({
                                condition: { ...currentForm, VAPVNO: APVNO },
                                ...updatedata, // ข้อมูลที่ต้องการอัปเดต
                            })
                            .catch((err) => {}), // .catch ใส่ไว้กันเหนียว กรณีที่ Database มีปัญหาจริงๆ จะได้ไม่พัง

                        // เงื่อนไขที่ 2
                        this.flowService
                            .updateFlow({
                                condition: { ...currentForm, VREPNO: APVNO },
                                ...updatedata,
                            })
                            .catch((err) => {}),
                    ]);
                }
                await this.doactionService.doAction(
                    {
                        ...currentForm,
                        ACTION: 'reject',
                        EMPNO: APVNO,
                        REMARK: REMARK,
                    },
                    ip,
                );
                // if (CEXTDATA == 4) {
                //     const res = await this;
                // }
            } else if (ACTION == 'sendApv') {
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
                            requestedBy: APVNO, // เปลี่ยนเป็นตัวแปรที่เก็บผู้ขอ/ผู้อัปโหลดใน dto ของคุณ
                        });
                    }
                }
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
            } else if (ACTION == 'saveData') {
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
                            requestedBy: APVNO, // เปลี่ยนเป็นตัวแปรที่เก็บผู้ขอ/ผู้อัปโหลดใน dto ของคุณ
                        });
                    }
                }
            } else if (ACTION == 'deleteApv') {
                const resfile =
                    await this.attcnfrmrepo.getQaFileAll(currentForm);
                for (const f of resfile) {
                    const destination = await joinPaths(
                        path +
                            currentForm.NFRMNO +
                            '_' +
                            currentForm.VORGNO +
                            '_' +
                            currentForm.CYEAR +
                            '_' +
                            currentForm.CYEAR2 +
                            '_' +
                            currentForm.NRUNNO,
                        f.SFILE,
                    );
                    await deleteFile(destination);
                }
                await this.repoDwg.deleteByAll(currentForm);
                await this.attcnfrmrepo.deleteAll(currentForm);
                await this.repoCnform.deleteAll(currentForm);
                await this.formCreateService.deleteFlowAndForm({
                    condition: currentForm,
                });
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
}
