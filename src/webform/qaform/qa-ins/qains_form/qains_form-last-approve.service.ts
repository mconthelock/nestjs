import { Injectable } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UsersService } from 'src/escs/user/user.service';
import { UserItemService } from 'src/escs/user-item/user-item.service';
import { ItemStationService } from 'src/escs/item-station/item-station.service';
import { UsersItemStationService } from 'src/escs/user-item-station/user-item-station.service';
import { UsersFileService } from 'src/escs/user-file/user-file.service';
import { UsersAuthorizeService } from 'src/escs/user-authorize/user-authorize.service';
import { PDFService } from 'src/common/services/pdf/pdf.service';
import { QainsFormRepository } from './qains_form.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { QAINS_FORM } from 'src/common/Entities/webform/table/QAINS_FORM.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { joinPaths } from 'src/common/utils/files.utils';
import { MailService } from 'src/common/services/mail/mail.service';
import { AmecUserAllService } from 'src/amec/amecuserall/amecuserall.service';

@Injectable()
export class QainsFormLastApproveService extends QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,

        private readonly escsUserService: UsersService,
        private readonly escsUserItemService: UserItemService,
        private readonly escsItemStationService: ItemStationService,
        private readonly escsUserItemStationService: UsersItemStationService,
        private readonly PDFService: PDFService,
        private readonly escsUserFileService: UsersFileService,
        private readonly escsUserAuthorizeService: UsersAuthorizeService,

        private readonly qainsOAService: QainsOAService,
        private readonly doactionFlowService: DoactionFlowService,
        private readonly amecuserAllService: AmecUserAllService,
    ) {
        super(flowService, repo, mailService);
    }
    async lastApprove(dto: doactionFlowDto, ip: string) {
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            // Get form data
            const formData: QAINS_FORM = await this.getFormData(form);

            const secid: number = formData.QA_INCHARGE_SECTION;

            // search operator
            const operator = await this.qainsOAService.searchQainsOA({
                ...form,
                QOA_TYPECODE: 'ESO',
            });

            const pass = operator.filter((o) => o.QOA_RESULT == 1);
            const notPass = operator.filter((o) => o.QOA_RESULT == 0);

            if (pass.length != 0) {
                for (const p of pass) {
                    const stationList: {
                        stationNo: number;
                        stationName: string;
                    }[] = [];
                    const savePath: string = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/escs/user/${p.QOA_EMPNO}/`;
                    const checkUser = await this.escsUserService.getUser({
                        USR_NO: p.QOA_EMPNO,
                    });

                    if (checkUser.length == 0) {
                        // add user
                        await this.escsUserService.addUser({
                            USR_NO: p.QOA_EMPNO,
                            USR_NAME: p.QOA_EMPNO_INFO.SNAME,
                            USR_EMAIL: p.QOA_EMPNO_INFO.SRECMAIL,
                            GRP_ID: 1, // user group INSPECTOR
                            SEC_ID: secid,
                            USR_USERUPDATE: 0,
                        });
                    }
                    // add user item in escs
                    await this.escsUserItemService.addUserItem({
                        USR_NO: p.QOA_EMPNO,
                        IT_NO: formData.QA_ITEM,
                        UI_USERUPDATE: dto.EMPNO,
                    });

                    // add user item station in escs
                    if (p.QOA_STATION) {
                        const station = p.QOA_STATION.split('|');
                        for (const s of station) {
                            const stationNo = parseInt(s);
                            const stationData =
                                await this.escsItemStationService.searchItemStation(
                                    { ITS_NO: stationNo },
                                );
                            const stationName =
                                stationData.length > 0
                                    ? stationData[0].ITS_STATION_NAME
                                    : '';
                            await this.escsUserItemStationService.addUserItemStation(
                                {
                                    US_USER: p.QOA_EMPNO,
                                    US_ITEM: formData.QA_ITEM,
                                    US_STATION: stationName,
                                    US_STATION_NO: stationNo,
                                },
                            );
                            stationList.push({ stationNo, stationName });
                        }
                    }
                    // create pdf file
                    const { fileName, filePath } = await this.createPDF(
                        savePath,
                        formData,
                        dto.EMPNO,
                        p.QOA_EMPNO_INFO,
                        stationList,
                    );

                    // add user file in escs
                    //   const id = await this.escsUserFileService.newId({
                    //     UF_ITEM: formData.QA_ITEM,
                    //     UF_STATION: 0,
                    //     UF_USR_NO: p.QOA_EMPNO,
                    //   });
                    await this.escsUserFileService.addUserFile({
                        UF_ITEM: formData.QA_ITEM,
                        UF_STATION: 0,
                        UF_USR_NO: p.QOA_EMPNO,
                        //   UF_ID: id,
                        UF_ONAME: `${formData.QA_ITEM}_authorize.pdf`,
                        UF_FNAME: fileName,
                        UF_PATH: filePath,
                    });
                    // insert authorize score
                    await this.escsUserAuthorizeService.addUserAuth({
                        UA_ITEM: formData.QA_ITEM,
                        UA_STATION: 0,
                        UA_USR_NO: p.QOA_EMPNO,
                        UA_SCORE: p.QOA_SCORE,
                        UA_GRADE: p.QOA_GRADE,
                        UA_PERCENT: p.QOA_PERCENT,
                        UA_TOTAL: formData.QA_REV_INFO.ARR_TOTAL,
                        UA_REV: formData.QA_REV,
                        UA_TEST_BY: formData.QA_INCHARGE_EMPNO,
                        UA_TEST_DATE: formData.QA_OJT_DATE,
                    });

                    // add user file station in escs
                    if (stationList.length > 0) {
                        for (const s of stationList) {
                            const id = await this.escsUserFileService.newId({
                                UF_ITEM: formData.QA_ITEM,
                                UF_STATION: s.stationNo,
                                UF_USR_NO: p.QOA_EMPNO,
                            });
                            await this.escsUserFileService.addUserFile({
                                UF_ITEM: formData.QA_ITEM,
                                UF_STATION: s.stationNo,
                                UF_USR_NO: p.QOA_EMPNO,
                                UF_ID: id,
                                UF_ONAME: `${formData.QA_ITEM}_${s.stationName}_authorize.pdf`,
                                UF_FNAME: fileName,
                                UF_PATH: filePath,
                            });

                            // insert authorize score
                            await this.escsUserAuthorizeService.addUserAuth({
                                UA_ITEM: formData.QA_ITEM,
                                UA_STATION: s.stationNo,
                                UA_USR_NO: p.QOA_EMPNO,
                                UA_SCORE: p.QOA_SCORE,
                                UA_GRADE: p.QOA_GRADE,
                                UA_PERCENT: p.QOA_PERCENT,
                                UA_TOTAL: formData.QA_REV_INFO.ARR_TOTAL,
                                UA_REV: formData.QA_REV,
                                UA_TEST_BY: formData.QA_INCHARGE_EMPNO,
                                UA_TEST_DATE: formData.QA_OJT_DATE,
                            });
                        }
                    }
                }
            }

            // not pass
            if (notPass.length > 0) {
                for (const p of notPass) {
                    // insert authorize score
                    await this.escsUserAuthorizeService.addUserAuth({
                        UA_ITEM: formData.QA_ITEM,
                        UA_STATION: 0,
                        UA_USR_NO: p.QOA_EMPNO,
                        UA_SCORE: p.QOA_SCORE,
                        UA_GRADE: p.QOA_GRADE,
                        UA_PERCENT: p.QOA_PERCENT,
                        UA_TOTAL: formData.QA_REV_INFO.ARR_TOTAL,
                        UA_REV: formData.QA_REV,
                        UA_TEST_BY: formData.QA_INCHARGE_EMPNO,
                        UA_TEST_DATE: formData.QA_OJT_DATE,
                    });
                    const stationList = [];

                    // add user item station in escs
                    if (p.QOA_STATION) {
                        const station = p.QOA_STATION.split('|');
                        for (const s of station) {
                            const stationNo = parseInt(s);
                            // insert authorize score
                            await this.escsUserAuthorizeService.addUserAuth({
                                UA_ITEM: formData.QA_ITEM,
                                UA_STATION: stationNo,
                                UA_USR_NO: p.QOA_EMPNO,
                                UA_SCORE: p.QOA_SCORE,
                                UA_GRADE: p.QOA_GRADE,
                                UA_PERCENT: p.QOA_PERCENT,
                                UA_TOTAL: formData.QA_REV_INFO.ARR_TOTAL,
                                UA_REV: formData.QA_REV,
                                UA_TEST_BY: formData.QA_INCHARGE_EMPNO,
                                UA_TEST_DATE: formData.QA_OJT_DATE,
                            });
                        }
                    }
                }
            }
            // do action
            await this.doactionFlowService.doAction(
                {
                    ...form,
                    REMARK: dto.REMARK,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                },
                ip,
            );

            // send mail
            await this.sendMailAuthurize(formData, pass);
            return {
                status: true,
                message: 'Action successful',
                data: dto,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createPDF(
        savePath: string,
        formData: QAINS_FORM,
        realApv: string,
        empInfo?: AMECUSERALL,
        stations?: { stationNo: number; stationName: string }[],
    ): Promise<{ fileName: string; filePath: string }> {
        const fileName = `${now('YYYYMMDD_HHmmss')}_${Math.floor(Math.random() * 9000) + 1000}_${formData.QA_ITEM}_authorize.pdf`;
        let trItem = '',
            tableOperator = '',
            stampQcFr = '',
            stampMfgSem = '',
            stampMfgFr = '';
        // set list and checked
        var listItem = `<li>4.1 ${formData.QA_ITEM}</li>`;
        if (stations && stations.length > 0) {
            for (const [index, s] of stations.entries()) {
                if (index == 0) {
                    listItem = `<li>4.${index + 1} ${formData.QA_ITEM},  ${s.stationName}</li>`;
                } else {
                    trItem += `<tr class="">
                        <td>
                            <ul>
                                <li class="ml-4"> 4.${index + 1} ${formData.QA_ITEM},  ${s.stationName}</li>
                            </ul>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            <i class="icofont-ui-check text-green-600"></i>
                        </td>
                        <td class=""></td>
                    </tr>`;
                }
            }
        }

        // set operator List
        if (empInfo) {
            tableOperator = `
      <table class="table table-sm mt-8" id="table2">
                <thead>
                    <tr>
                        <th class="text-sm">No</th>
                        <th class="text-sm">Name</th>
                        <th class="text-sm">Started Working Date</th>
                        <th class="text-sm">ID Card</th>
                        <th class="text-sm">Authorized Inspector Conclusion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td class="">${empInfo.SEMPPRE} ${empInfo.SNAME}</td>
                        <td class="text-center">${formatDate(formData.QA_OJT_DATE, 'DD-MMM-YY') ?? '-'}</td>
                        <td class="text-center">${empInfo.SEMPNO}</td>
                        <td rowspan="1">
                            <div class="flex flex-col items-start gap-2 ml-auto">
                                    <label class="label">
                                            <input type="checkbox" class="checkbox"/>
                                            <span class="label-text ml-2">For Receiving Inspection</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox"/>
                                            <span class="label-text ml-2">For Inprocess Inspection</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox" checked/>
                                            <span class="label-text ml-2">For Final Inspection</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox" checked/>
                                            <span class="label-text ml-2">Pass</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox"/>
                                            <span class="label-text ml-2">Pending for Re-OJT</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox"/>
                                            <span class="label-text ml-2">Termination</span>
                                    </label>
                                    <label class="label">
                                            <input type="checkbox" class="checkbox"/>
                                            <span class="label-text ml-2">Others.....</span>
                                    </label>
                                </div>
                        </td>
                        </tr>
                </tbody>
            </table>
      `;
        }

        // set stamp
        const flow = await this.flowService.getFlow({
            NFRMNO: formData.NFRMNO,
            VORGNO: formData.VORGNO,
            CYEAR: formData.CYEAR,
            CYEAR2: formData.CYEAR2,
            NRUNNO: formData.NRUNNO,
        });

        for (const f of flow) {
            switch (f.CEXTDATA) {
                case '03':
                    stampMfgFr = `<p>${f.VREALAPV}</p><p>${formatDate(f.DAPVDATE, 'DD-MMM-YY')}</p>`;
                    break;
                case '04':
                    stampMfgSem = `<p>${f.VREALAPV}</p><p>${formatDate(f.DAPVDATE, 'DD-MMM-YY')}</p>`;
                    break;
                case '05':
                    stampQcFr = `<p>${f.VREALAPV}</p><p>${formatDate(f.DAPVDATE, 'DD-MMM-YY')}</p>`;
                    break;
            }
        }

        const html = `
    <!doctype html>
    <html lang="th">
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <link rel="stylesheet" href="${process.env.APP_HOST}/form/assets/dist/css/tailwind.css">
            <link rel="stylesheet" href="${process.env.APP_HOST}/cdn/icofont/icofont.min.css">
            <style>
                html, body {
                    background: #fff !important;
                }
                #table1 td {
                    border: 1px solid #000;
                }
                #table2 td {
                    border: 0;
                    vertical-align: top;
                }
                #stamp td, #stamp th {
                    border: 1px solid #000;
                }

            </style>
        </head>
        <body>
            <table class="table table-sm" id="table1">
                <tbody>
                    <tr class="bg-gray-300">
                        <td colspan="4" class="text-center font-bold text-xl">Evaluation and recognition for Authorized Inspector</td>
                    </tr>
                    <tr class="bg-gray-300">
                        <td colspan="4" class="text-center font-bold text-xl">(In case of MFG operator Self inspection)</td>
                    </tr>
                    <tr class="bg-gray-300">
                        <td rowspan="2" class="text-center font-bold text-xl">Items Education/Training</td>
                        <td colspan="3" class="text-center font-bold">Result of Evaluation</td>
                    </tr>
                    <tr class="bg-gray-300">
                        <td class="text-center font-bold">GOOD</td>
                        <td class="text-center font-bold">PASS</td>
                        <td class="text-center font-bold">FAIL</td>
                    </tr>
                    <tr class="">
                        <td>
                            <div class="flex gap-2">
                                <span>1.</span>
                                <ul>
                                    <li>Manufacturing Process</li>
                                    <li>Inspection Process</li>
                                    <li>Calibration System</li>
                                </ul>
                            </div>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            <p><i class="icofont-ui-check text-green-600"></i></p>
                            <p><i class="icofont-ui-check text-green-600"></i></p>
                            <p><i class="icofont-ui-check text-green-600"></i></p>
                        </td>
                        <td class=""></td>
                    </tr>
                    <tr class="">
                        <td>
                            <div class="flex gap-2">
                                <span>2.</span>
                                <ul>
                                    <li>How to read drawing</li>
                                </ul>
                            </div>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            <p><i class="icofont-ui-check text-green-600"></i></p>
                        </td>
                        <td class=""></td>
                    </tr>
                    <tr class="">
                        <td>
                            <div class="flex gap-2">
                                <span>3.</span>
                                <ul>
                                    <li>Elevator Parts and Escalator Parts</li>
                                </ul>
                            </div>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            <p><i class="icofont-ui-check text-green-600"></i></p>
                        </td>
                        <td class=""></td>
                    </tr>
                    <tr class="">
                        <td>
                            <div class="flex gap-2">
                                <span>4.</span>
                                <ul>
                                    <li class="mb-2">Specified Jobs(OJT)</li>
                                    ${listItem}
                                </ul>
                            </div>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            <i class="icofont-ui-check text-green-600"></i>
                        </td>
                        <td class=""></td>
                    </tr>
                    ${trItem}
                </tbody>
            </table>
            ${tableOperator}
            <span class="mt-4 text-base text-sm text-gray-500">Note: Evaluation/Recognition shall be done by interview or OJT condition</span>
            <table id="stamp" class="table table-sm w-1/2 ml-auto text-sm">
                <thead>
                    <tr>
                        <th class="text-center">QC SEM</th>
                        <th class="text-center">QC F/L</th>
                        <th class="text-center">MFG SEM</th>
                        <th class="text-center">MFG F/L</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-center">
                            <p>${realApv}</p>
                            <p>${now('DD-MM-YY')}</p>
                        </td>
                        <td class="text-center">${stampQcFr}</td>
                        <td class="text-center">${stampMfgSem}</td>
                        <td class="text-center">${stampMfgFr}</td>
                    </tr>
                </tbody>
            </table>
            <span class="block text-sm font-bold w-full text-center mt-5"> QA_QP-K002-C (5 OF 6)</span>
        </body>
    </html>`;
        await this.PDFService.generatePDF({
            html: html,
            options: {
                path: await joinPaths(savePath, fileName),
                printBackground: true,
                margin: {
                    top: '15mm',
                    right: '15mm',
                    bottom: '15mm',
                    left: '15mm',
                },
            },
        });
        return { fileName, filePath: savePath };
    }

    async sendMailAuthurize(data: QAINS_FORM, pass: any) {
        if (pass.length == 0) return;
        let to = [];
        let cc = [];

        // get flow
        const flow = await this.flowService.getFlow({
            NFRMNO: data.NFRMNO,
            VORGNO: data.VORGNO,
            CYEAR: data.CYEAR,
            CYEAR2: data.CYEAR2,
            NRUNNO: data.NRUNNO,
        });

        // set mail to and cc
        for (const f of flow) {
            const semInfo = await this.amecuserAllService.findEmp(f.VREALAPV);
            if (!semInfo.status) continue;
            switch (f.CEXTDATA) {
                case null:
                case '':
                    to.push(semInfo.data.SRECMAIL);
                    break;
                default:
                    if (!cc.includes(semInfo.data.SRECMAIL))
                        cc.push(semInfo.data.SRECMAIL);
                    break;
            }
        }

        // set mail list
        let list = '';
        for (const [index, p] of pass.entries()) {
            list += `<tr>
            <td>${index + 1}</td>
            <td>${p.QOA_EMPNO}</td>
            <td>${p.QOA_EMPNO_INFO.SEMPPRE}${p.QOA_EMPNO_INFO.SNAME}</td>
        </tr>`;
        }

        let html = `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <style type="text/css">
                        body{
                            font-size:20px !important;
                        }
                        table {
                            width: fit-content;
                            border-collapse: collapse;
                        }
                        th{
                            background-color:yellow;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <p>เนื่องจากพนักงานได้สอบผ่านการประเมิณใน Item ${data.QA_ITEM} ดังนั้นพนักงานสามารถเข้าใช้โปรแกรม E-Check Sheet ได้</p>
                        <p style="font-weight: bold;">*** พนักงานสามารถเข้าใช้โปรแกรมด้วยรหัสของพนักงาน (รหัสเดียวกับ Webflow) ***</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>EMPNO.</th>
                                    <th>NAME.</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${list}
                            </tbody>
                        </table>
                        <p>- ในกรณีที่พนักงานจำรหัสผ่านไม่ได้ ให้กดลืม Password ของ Webflow และใส่รหัสพนักงาน จากนั้นจะมี e-mail แจ้งไปที่หัวหน้างานต้นสังกัด</p>
                        <p>- ในกรณีที่พนักงานไม่สามารถเข้าใช้งานโปรแกรมได้ กรุณาติดต่อผู้ดูแลระบบ Tel.2038</p>
                        <p>
                            Best regards,<br>
                            IS Department.<br>
                            Auto Send mail System.
                        </p>
                    </div>
                </body>
            </html>`;
        await this.mailService.sendMail({
            to: to,
            cc: cc,
            bcc: process.env.MAIL_ADMIN,
            from: 'webflow_admin@mitsubishielevatorasia.co.th',
            subject: `แจ้ง Login การเข้าใช้งานโปรแกรม E-Check Sheet สำหรับ Item ${data.QA_ITEM}`,
            html: html,
        });
    }
}
