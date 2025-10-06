import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import {
  moveFileFromMulter,
  deleteFile,
  joinPaths,
} from 'src/common/utils/files.utils';
import { QainsForm } from '../qains_form/entities/qains_form.entity';
import { FormService } from 'src/webform/form/form.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { QaFileService } from '../../qa_file/qa_file.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { UsersService } from 'src/amec/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';
import { SearchQainsFormDto } from './dto/search-qains_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { QcConfQainsFormDto } from './dto/qcConfirm-qains_form.dto';
import { UpdateQainsFormDto } from './dto/update-qains_form.dto';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';
import { ESCSUserService } from 'src/escs/user/user.service';
import { ESCSUserItemService } from 'src/escs/user-item/user-item.service';
import { ESCSItemStationService } from 'src/escs/item-station/item-station.service';
import { ESCSUserItemStationService } from 'src/escs/user-item-station/user-item-station.service';
import { PDFService } from 'src/pdf/pdf.service';

@Injectable()
export class QainsFormService {
  constructor(
    @InjectRepository(QainsForm, 'amecConnection')
    private readonly qaformRepo: Repository<QainsForm>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,

    private readonly formService: FormService,
    private readonly flowService: FlowService,
    private readonly QainsOAService: QainsOAService,
    private readonly QaFileService: QaFileService,
    private readonly sequenceOrgService: SequenceOrgService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly orgposService: OrgposService,
    private readonly escsUserService: ESCSUserService,
    private readonly escsUserItemService: ESCSUserItemService,
    private readonly escsItemStationService: ESCSItemStationService,
    private readonly escsUserItemStationService: ESCSUserItemStationService,
    private readonly PDFService: PDFService,
  ) {}

  async createQainsForm(
    dto: CreateQainsFormDto,
    files: Express.Multer.File[],
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const createForm = await this.formService.create(
        {
          NFRMNO: dto.NFRMNO,
          VORGNO: dto.VORGNO,
          CYEAR: dto.CYEAR,
          REQBY: dto.REQUESTER,
          INPUTBY: dto.CREATEBY,
          REMARK: dto.REMARK,
        },
        ip,
        queryRunner,
      );

      if (!createForm.status) {
        throw new Error(createForm.message);
      }

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
      };

      // update flow incharge1
      const condIncharge1 = {
        condition: {
          ...form,
          CEXTDATA: '01',
        },
        VAPVNO: dto.QA_INCHARGE_EMPNO,
        VREPNO: dto.QA_INCHARGE_EMPNO,
      };
      this.flowService.updateFlow(condIncharge1, queryRunner);

      // update flow incharge2
      const condIncharge2 = {
        condition: {
          ...form,
          CEXTDATA: '02',
        },
        VAPVNO: dto.QA_INCHARGE_EMPNO,
        VREPNO: dto.QA_INCHARGE_EMPNO,
      };
      this.flowService.updateFlow(condIncharge2, queryRunner);

      // update flow req foreman
      const condForeman = {
        condition: {
          ...form,
          CEXTDATA: '03',
        },
        VAPVNO: dto.REQUESTER,
        VREPNO: dto.REQUESTER,
      };
      this.flowService.updateFlow(condForeman, queryRunner);

      await queryRunner.manager.save(QainsForm, {
        ...form,
        QA_ITEM: dto.QA_ITEM,
        QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
        QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
      });

      for (const e of dto.OPERATOR) {
        await this.QainsOAService.createQainsOA(
          { ...form, QOA_TYPECODE: 'ESO', QOA_EMPNO: e },
          queryRunner,
        );
      }

      const formNo = await this.formService.getFormno(form); // Get the form number
      const destination = path + '/' + formNo; // Get the destination path
      for (const file of files) {
        // console.log('file: ', file);
        const moved = await moveFileFromMulter(file, destination);
        movedTargets.push(moved.path);
        // 2) บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
        await this.QaFileService.createQaFile(
          {
            ...form,
            FILE_TYPECODE: 'ESF',
            FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
            FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
            FILE_USERCREATE: dto.REQUESTER,
            FILE_PATH: destination, // โฟลเดอร์ปลายทาง
          },
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful',
        // files: moveFile,
        data: dto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      await Promise.allSettled([
        ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
        ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      ]);
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async getFormData(dto: FormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsForm)
      : this.qaformRepo;

    return repo.findOne({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      },
      relations: [
        // 'QA_AUD_OPT',
        // 'QA_AUD_OPT.TYPE',
        // 'QA_AUD_OPT.QOA_EMPNO_INFO',
        // 'QA_AUD_OPT.QA_AUDIT',
        // 'QA_AUD_OPT.QA_FILES',
        // 'QA_FILES',
        // 'QA_FILES.TYPE',
        'QA_INCHARGE_INFO',
        'QA_INCHARGE_SECTION_INFO',
        'QA_REV_INFO',
        // 'QA_MASTER',
        // 'ITEM_STATION'
      ],
      //   order: {
      // QA_AUD_OPT: { QOA_SEQ: 'ASC' }, // แทน ORDER BY ใน subquery เดิม
      // QA_FILES: { FILE_ID: 'ASC' },
      // QA_MASTER: { ARM_NO: 'ASC', ARM_SEQ: 'ASC' },
      //   },
    });
  }

  async search(dto: SearchQainsFormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsForm)
      : this.qaformRepo;

    return repo.find({
      where: {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QA_ITEM: dto.QA_ITEM,
        QA_INCHARGE_SECTION: dto.QA_INCHARGE_SECTION,
        QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
      },
      relations: [
        'QA_AUD_OPT',
        'QA_AUD_OPT.TYPE',
        'QA_AUD_OPT.QOA_EMPNO_INFO',
        'QA_FILES',
        'QA_FILES.TYPE',
        'QA_INCHARGE_INFO',
        'QA_INCHARGE_SECTION_INFO',
      ],
      order: {
        QA_AUD_OPT: { QOA_SEQ: 'ASC' }, // แทน ORDER BY ใน subquery เดิม
        QA_FILES: { FILE_ID: 'ASC' },
      },
    });
  }

  async update(dto: UpdateQainsFormDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ...data } = dto;
      const condition = { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO };

      const res = await runner.manager
        .getRepository(QainsForm)
        .update(condition, data);

      if (localRunner) await localRunner.commitTransaction();
      if (!res) {
        throw new Error('No rows updated');
      } else {
        return { status: true, result: res, message: 'success' };
      }
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return {
          status: false,
          message: error.message,
        };
      } else {
        throw new Error(error.message);
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async qcConfirm(dto: QcConfQainsFormDto, ip: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const form: FormDto = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };
      //   await this.sendmailToReqManager(form, queryRunner);
      //   return;
      // update flow qc foreman
      const condForeman = {
        condition: {
          ...form,
          CEXTDATA: '05',
        },
        VAPVNO: dto.QCFOREMAN,
        VREPNO: dto.QCFOREMAN,
      };
      this.flowService.updateFlow(condForeman, queryRunner);

      // update flow qc sem
      const foreman = await this.usersService.findEmp(
        dto.QCFOREMAN,
        queryRunner,
      );
      const qcsem = await this.orgposService.getOrgPos(
        {
          VPOSNO: '30',
          VORGNO: foreman.SSECCODE,
        },
        queryRunner,
      );
      //   const qcsem = await this.sequenceOrgService.search(
      //     { SPOSCODE: '30', VORGNO: foreman.SSECCODE },
      //     queryRunner,
      //   );
      if (qcsem.length > 0) {
        const condSem = {
          condition: {
            ...form,
            CEXTDATA: '06',
          },
          VAPVNO: qcsem[0].VEMPNO,
          VREPNO: qcsem[0].VEMPNO,
        };
        this.flowService.updateFlow(condSem, queryRunner);
      }
      // update ojt date and training date
      await this.update(
        {
          ...form,
          QA_TRAINING_DATE: dto.TRAINING_DATE,
          QA_OJT_DATE: dto.OJTDATE,
          QA_REV: dto.QA_REV,
        },
        queryRunner,
      );

      // clear
      await this.QainsOAService.delete(
        { ...form, QOA_TYPECODE: 'ESA' },
        queryRunner,
      );

      // insert auditor
      for (const e of dto.AUDITOR) {
        await this.QainsOAService.createQainsOA(
          { ...form, QOA_TYPECODE: 'ESA', QOA_EMPNO: e },
          queryRunner,
        );
      }
      // do action
      await this.flowService.doAction(
        { ...form, REMARK: dto.REMARK, ACTION: dto.ACTION, EMPNO: dto.EMPNO },
        ip,
        queryRunner,
      );
      // auto mail
      await this.sendmailToReqManager(form, queryRunner);
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Action successful',
        data: dto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async sendmailToReqManager(form: FormDto, queryRunner?: QueryRunner) {
    const data = await this.getFormData(form, queryRunner);
    const operator = await this.QainsOAService.searchQainsOA(
      { ...form, QOA_TYPECODE: 'ESO' },
      queryRunner,
    );
    const item = data.QA_ITEM;
    let html = `<div style="font-size:14px; color:#000;">`;
    const seccode = [
      ...new Set(operator.map((o) => o.QOA_EMPNO_INFO.SSECCODE)),
    ];
    // console.log(seccode);

    for (const sec of seccode) {
      const semEmpno = await this.orgposService.getOrgPos(
        {
          VPOSNO: '30',
          VORGNO: sec,
        },
        queryRunner,
      );
      const semInfo = await this.usersService.findEmp(semEmpno[0].VEMPNO);
      console.log('semInfo', semInfo);

      html += `<b>Dear ${semInfo.SNAME}</b>
        <p>
            I'm writing to arrange a time for 
            <span style="font-weight:bold; color:#0000FF;">
                quality built in for item ${item} on ${data.QA_OJT_DATE ? formatDate(data.QA_OJT_DATE, 'DD-MMM-YY') : '-'} ${data.QA_OJT_DATE ? formatDate(data.QA_OJT_DATE, 'HH:mm') : '00:00'} 
            </span>.
            <br>
            Please prepare part orders for quality built in.
        </p>

        <table cellpadding="6" cellspacing="0" border="1" 
        style="border: 1px solid #aaa; width: 100%; padding: 0px; font-size: 0.85em;">
            <thead>
                <tr style="background:#fce4ec; text-align:left; padding: 10px 0px;">
                <th style="border:1px solid #ccc;">No.</th>
                <th style="border:1px solid #ccc;">Emp. Code</th>
                <th style="border:1px solid #ccc;">Name - Surname</th>
                <th style="border:1px solid #ccc;">Item</th>
                <th style="border:1px solid #ccc;">Sec.</th>
                </tr>
            </thead>
            <tbody>`;
      let no = 1;
      for (const o of operator) {
        if (o.QOA_EMPNO_INFO.SSECCODE === sec) {
          html += `<tr style="background-color: #fff;padding: 10px; 5px;>
          <td style="border:1px solid #ccc; text-align:center;">${no}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO_INFO.SNAME}</td>
          <td style="border:1px solid #ccc; text-align:center;">${item}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO_INFO.SSEC}</td>
          </tr>
            `;
          no++;
        }
      }
      html += `</tbody>
            </table>
            <p>
                Best regards,<br>
                IS Department.<br>
                Auto Send mail System.
            </p>
        </div>`;
      await this.mailService.sendMail({
        // to: semInfo.SRECMAIL,
        from: 'webflow_admin@mitsubishielevatorasia.co.th',
        subject: `Quality built in item ${item}`,
        html: html,
      });
    }
  }

  async lastApprove(dto: doactionFlowDto, ip: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const form: FormDto = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };

      // Get form data
      const formData = await this.getFormData(form, queryRunner);

      const secid = formData.QA_INCHARGE_SECTION;

      // search operator
      const operator = await this.QainsOAService.searchQainsOA(
        { ...form, QOA_TYPECODE: 'ESO' },
        queryRunner,
      );

      const pass = operator.filter((o) => o.QOA_RESULT == 1);
      const notPass = operator.filter((o) => o.QOA_RESULT == 0);
      console.log('pass', pass);
      console.log('notPass', notPass);

      if (pass.length != 0) {
        for (const p of pass) {
          const stationList = [];
          const savePath = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/escs/user/${p.QOA_EMPNO}/`;
          const checkUser = await this.escsUserService.getUser(
            { USR_NO: p.QOA_EMPNO },
            queryRunner,
          );
          console.log('checkUser', checkUser);
          if (checkUser.length == 0) {
            // add user
            await this.escsUserService.addUser(
              {
                USR_NO: p.QOA_EMPNO,
                USR_NAME: p.QOA_EMPNO_INFO.SNAME,
                USR_EMAIL: p.QOA_EMPNO_INFO.SRECMAIL,
                GRP_ID: 1, // user group INSPECTOR
                SEC_ID: secid,
                USR_USERUPDATE: 0,
              },
              queryRunner,
            );
          }
          // add user item in escs
          await this.escsUserItemService.addUserItem(
            {
              USR_NO: p.QOA_EMPNO,
              IT_NO: formData.QA_ITEM,
            },
            queryRunner,
          );

          // add user item station in escs
          if (p.QOA_STATION) {
            const station = p.QOA_STATION.split('|');
            for (const s of station) {
              const stationNo = parseInt(s);
              const stationData =
                await this.escsItemStationService.searchItemStation(
                  { ITS_NO: stationNo },
                  queryRunner,
                );
              const stationName =
                stationData.length > 0 ? stationData[0].ITS_STATION_NAME : '';
              await this.escsUserItemStationService.addUserItemStation(
                {
                  US_USER: p.QOA_EMPNO,
                  US_ITEM: formData.QA_ITEM,
                  US_STATION: stationName,
                  US_STATION_NO: stationNo,
                },
                queryRunner,
              );
              stationList.push({ stationNo, stationName });
            }
          }
          // create pdf file
          const { fileName, filePath } = await this.createPDF(
            savePath,
            formData.QA_ITEM,
            stationList,
          );

          // add user file in escs
        }
      }
      //   throw new Error('test rollback');

      await queryRunner.commitTransaction();
      return {
        status: false,
        message: 'Action successful',
        data: dto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async createPDF(
    savePath: string,
    item: string,
    stations?: { stationNo: number; stationName: string }[],
  ): Promise<{ fileName: string; filePath: string }> {
    const fileName = `${now('YYYYMMDD_HHmmss')}_${Math.floor(Math.random() * 9000) + 1000}_${item}_authorize.pdf`;
    let list = '',
      checked = '';
    if (stations && stations.length > 0) {
      for (const [index, s] of stations.entries()) {
        list += `<li>4.${index + 1} ${item}  ${s.stationName}</li>`;
        checked += `<p><i class="icofont-ui-check text-xl text-green-600"></i></p>`;
      }
    } else {
      list += `<li>4.1 ${item}  - </li>`;
      checked += `<p><i class="icofont-ui-check text-xl text-green-600"></i></p>`;
    }
    let html = `
    <!doctype html>
    <html lang="th">
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <link rel="stylesheet" href="${process.env.APP_HOST}/form/assets/dist/css/v1.0.1.min.css">
            <link rel="stylesheet" href="${process.env.APP_HOST}/cdn/icofont/icofont.min.css">
            <style>
                html, body {
                    background: #fff !important;
                }
                table td {
                    border: 2px solid #000;
                }
            </style>
        </head>
        <body>
            <table class="table">
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
                            <p><i class="icofont-ui-check text-xl text-green-600"></i></p>
                            <p><i class="icofont-ui-check text-xl text-green-600"></i></p>
                            <p><i class="icofont-ui-check text-xl text-green-600"></i></p>
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
                            <p><i class="icofont-ui-check text-xl text-green-600"></i></p>
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
                            <p><i class="icofont-ui-check text-xl text-green-600"></i></p>
                        </td>
                        <td class=""></td>
                    </tr>
                    <tr class="">
                        <td>
                            <div class="flex gap-2">
                                <span>4.</span>
                                <ul>
                                    <li>Specified Jobs(OJT)</li>
                                    ${list}
                                </ul>
                            </div>
                        </td>
                        <td class=""></td>
                        <td class="text-center">
                            ${checked}
                        </td>
                        <td class=""></td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>`;
    this.PDFService.generatePDF({
      html: html,
      options: {
        path: await joinPaths(savePath, fileName),
        printBackground: true,
      },
    });
    return { fileName, filePath: savePath };
  }
}
