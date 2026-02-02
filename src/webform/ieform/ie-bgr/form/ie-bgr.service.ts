import { Injectable } from '@nestjs/common';
import {
  BGRQuotationDto,
  BGRReturnDto,
  CreateIeBgrDto,
  DraftIeBgrDto,
} from './dto/create-ie-bgr.dto';
import { ReportIeBgrDto, UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import {
  deleteFile,
  joinPaths,
  moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { EbgreqformService } from 'src/ebudget/ebgreqform/ebgreqform.service';
import { EbgreqattfileService } from 'src/ebudget/ebgreqattfile/ebgreqattfile.service';
import { EbgreqcolImageService } from 'src/ebudget/ebgreqcol-image/ebgreqcol-image.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { EbudgetQuotationService } from 'src/ebudget/ebudget-quotation/ebudget-quotation.service';
import { EbudgetQuotationProductService } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.service';
import { LastApvIeBgrDto } from './dto/lastapv-ie-bgr.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PprbiddingService } from 'src/amec/pprbidding/pprbidding.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { IEBGR_REPORT_VIEW } from 'src/common/Entities/webform/views/IEBGR_REPORT_VIEW.entity';
import { PpoService } from 'src/amec/ppo/ppo.service';

@Injectable()
export class IeBgrService {
  constructor(
    @InjectRepository(IEBGR_REPORT_VIEW, 'webformConnection')
    private readonly reportRepo: Repository<IEBGR_REPORT_VIEW>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private readonly formService: FormService,
    private readonly formmstService: FormmstService,
    private readonly ebudgetformService: EbgreqformService,
    private readonly ebudgetattfileService: EbgreqattfileService,
    private readonly ebudgetcolImageService: EbgreqcolImageService,
    private readonly flowService: FlowService,
    private readonly ebudgetQuotationService: EbudgetQuotationService,
    private readonly ebudgetQuotationProductService: EbudgetQuotationProductService,
    private readonly pprbiddingService: PprbiddingService,
    private readonly mailService: MailService,
    private readonly ppoService: PpoService
  ) {}

  private readonly fileType = {
    imageI: 1,
    imageP: 2,
    imageD: 3,
    imageN: 4,
    imageE: 5,
    imageS: 6,
    fileP: 1,
    fileR: 2,
    fileS: 3,
    fileM: 4,
    fileE: 5,
    fileU: 6,
    fileO: 7,
  } as const;

  async report(dto: ReportIeBgrDto) {
    const report = await this.reportRepo.find({
        where: {
            FORMNO: dto.FORMNO,
            DEPT: dto.DEPT,
            EMPNO: dto.EMPNO,
            FORM_STATUS: dto.FORM_STATUS,
        }
    });

    for( const r of report ) {
        const bidding = await this.pprbiddingService.search({
            EBUDGETNO: r.FORMNO
        });
        let list = [];
        for( const b of bidding ){
            const po = await this.ppoService.search({ SREFNO: b.SPRNO});
            if(po.length > 0){
                list.push({SPRNO: b.SPRNO, SPONO: po.map(p => p.SPONO)});
            }else{
                list.push({SPRNO: b.SPRNO, SPONO: []});
            }
        }
        r.prpo = list;
    }

    if(!dto.PRNO && !dto.PONO) return report;

    // กรองเฉพาะรายการที่ตรงกับ PRNO หรือ PONO ตามที่ระบุใน dto
    const filter = report.filter(r => {
        // prpo: Array<{ SPRNO: string, SPONO: string[] }>
        const matched = r.prpo.filter((p: { SPRNO: string; SPONO: string[] }) => {
            if (dto.PRNO && dto.PONO) {
                return p.SPRNO === dto.PRNO && p.SPONO.includes(dto.PONO);
            }
            if (dto.PRNO) {
                return p.SPRNO === dto.PRNO;
            }
            if (dto.PONO) {
                return p.SPONO.includes(dto.PONO);
            }
            return true;
        });
        return matched.length > 0;
    });
    return filter;
  }

  /**
   * Create IE-BGR form
   */
  async create(
    dto: CreateIeBgrDto,
    files: Partial<Record<keyof typeof this.fileType, Express.Multer.File[]>>,
    // {
    //   imageI?: Express.Multer.File[];
    //   imageP?: Express.Multer.File[];
    //   imageD?: Express.Multer.File[];
    //   imageN?: Express.Multer.File[];
    //   imageE?: Express.Multer.File[];
    //   imageS?: Express.Multer.File[];
    //   fileP?: Express.Multer.File[];
    //   fileR?: Express.Multer.File[];
    //   fileS?: Express.Multer.File[];
    //   fileM?: Express.Multer.File[];
    //   fileE?: Express.Multer.File[];
    //   fileO?: Express.Multer.File[];
    // },
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    let returnDelFiles: string[] = []; // เก็บ path ไฟล์ที่ต้องลบในกรณี Return
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 1. ตรวจสอบกรณีเป็นการ Return
      const form = await this.createForm({
        dto,
        ip,
        isReturn: dto.isReturn,
        queryRunner,
      });

      // 2. เตรียม path สำหรับเก็บไฟล์
      const destination = await this.createPath(form, path);

      // 3. Insert EBGREQFORM
      const resEbgform = await this.insertEbgreqform({
        dto,
        queryRunner,
        form,
      });

      // 4. บันทึกไฟล์
      const insertFile = await this.insertFiles({
        isReturn: dto.isReturn,
        returnData: dto.returnData,
        queryRunner,
        form,
        files,
        destination,
        movedTargets,
        returnDelFiles,
      });
      movedTargets = insertFile.movedTargets;
      returnDelFiles = insertFile.returnDelFiles;

      // 5. บันทึก Quotation และ Quotation Product
      const quotation = await this.insertQuotations({
        isReturn: dto.isReturn,
        returnData: dto.returnData,
        form,
        quotation: dto.quotation,
        createBy: dto.empInput,
        queryRunner,
      });

      // 6. ส่งเมลแจ้ง
      await this.flowService.sendMailToApprover(form, queryRunner);

      await queryRunner.commitTransaction();
      // 7 กรณีเป็นการ Return ให้ลบไฟล์ที่เตรียมไว้
      if (dto.isReturn) {
        for (const filePath of returnDelFiles) {
          await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
        }
      }

      return {
        status: true,
        message: 'Request successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      for (const filePath of movedTargets) {
        await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
      }
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async lastApprove(dto: LastApvIeBgrDto, ip: string) {
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
      // Insert PPRBIDDING
      for (const bidding of dto.pprbidding) {
        await this.pprbiddingService.create(
          {
            SPRNO: bidding.SPRNO,
            BIDDINGNO: bidding.BIDDINGNO,
            EBUDGETNO: bidding.EBUDGETNO,
          },
          queryRunner,
        );
      }

      // do action
      await this.flowService.doAction(
        { ...form, REMARK: dto.REMARK, ACTION: dto.ACTION, EMPNO: dto.EMPNO },
        ip,
        queryRunner,
      );

      const flowtree = await this.flowService.getFlowTree(form, queryRunner);
      const emails: Array<string> = [];
      for (const f of flowtree) {
        if (
          ['--', '04', '05', '06'].includes(f.CSTEPNO) &&
          !emails.includes(f.SRECMAIL)
        ) {
          emails.push(f.SRECMAIL);
        }
      }

      await this.mailService.sendMail({
        from: 'webflow_admin@MitsubishiElevatorAsia.co.th',
        to: emails,
        // to: process.env.MAIL_ADMIN,
        subject: 'Budget Requisition Form completed in the system',
        html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
            </head>
            <body>
            <section>
                <p>To : Requester and Concerned Manager,</p>
                <span>This is to inform you that the <b>Budget Requisition Form</b></span>
                <br>
                <span><b>( Budget No. ${await this.formService.getFormno(form)} )</b> has been <b>approved and completed in the system.</b></span>
                <br>
                <p>Please proceed with the next related actions as required.</p>
                <br>
                <p>
                    Best regards,<br>
                    IS Department.<br>
                    Auto Send mail System.
                </p>
            </section>
        </body>
    </html>`,
      });
      await queryRunner.commitTransaction();
      return {
        status: true,
        message: 'Action successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * บันทึกแบบร่าง (Draft)
   */
  // prettier-ignore
  async draft(
    dto: DraftIeBgrDto,
    files: Partial<Record<keyof typeof this.fileType, Express.Multer.File[]>>,
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    let returnDelFiles: string[] = []; // เก็บ path ไฟล์ที่ต้องลบในกรณี Return
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 1. สร้าง Form
      const form = await this.createForm({
        dto,
        ip,
        isReturn: dto.isReturn || false,
        isSave: dto.isSave || false,
        isDraft: dto.isDraft || false,
        Draft: dto.DRAFT || '',
        queryRunner,
      });
      // 2. เตรียม path สำหรับเก็บไฟล์
      const destination = await this.createPath(form, path);
      // 3. Insert EBGREQFORM
      const resEbgform = await this.insertEbgreqform({ dto, queryRunner, form });
      // 4. บันทึกไฟล์
      const { isReturn, returnData } = dto;
      const insertFileRes = await this.insertFiles({isReturn, returnData, queryRunner, form, files, destination, movedTargets, returnDelFiles});
      movedTargets = insertFileRes.movedTargets;
      returnDelFiles = insertFileRes.returnDelFiles;

      // 5. บันทึก Quotation และ Quotation Product
      const quotation = await this.insertQuotations({
        isReturn: dto.isReturn,
        returnData: dto.returnData,
        form,
        quotation: dto.quotation,
        createBy: dto.empInput,
        queryRunner,
      });


      await queryRunner.commitTransaction();

      // 6 กรณีเป็นการ Return ให้ลบไฟล์ที่เตรียมไว้
      if (dto.isReturn) {
        for (const filePath of returnDelFiles) {
          await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
        }
      }
      return {
        status: true,
        message: 'Draft successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      for (const filePath of movedTargets) {
        await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
      }
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  // สร้าง Form มี 4 กรณี
  // 1. New Form
  // 2. Return Form
  // 3. Draft Form
  // 4. Save Form
  async createForm({
    dto,
    ip,
    isReturn = false,
    isDraft = false,
    isSave = false,
    Draft = '',
    queryRunner,
  }: {
    dto: UpdateIeBgrDto;
    ip: string;
    isReturn?: boolean;
    isDraft?: boolean;
    isSave?: boolean;
    Draft?: string;
    queryRunner?: QueryRunner;
  }) {
    try {
      let form: FormDto;

      if (isReturn) {
        // 1.1 กรณี Return ให้ทำการ Do Action เลย
        form = {
          NFRMNO: dto.returnData.NFRMNO,
          VORGNO: dto.returnData.VORGNO,
          CYEAR: dto.returnData.CYEAR,
          CYEAR2: dto.returnData.CYEAR2,
          NRUNNO: dto.returnData.NRUNNO,
        };
        // 1.2 หากไม่ใช่การ save หรือก็คือการ return จริงๆ ให้ทำการ do action
        if (!isSave) {
          await this.flowService.doAction(
            {
              ...form,
              ACTION: dto.returnData.ACTION,
              EMPNO: dto.returnData.EMPNO,
              REMARK: dto.remark,
            },
            ip,
            queryRunner,
          );
        }
      } else {
        // 1.3 กรณี New ให้สร้าง Form ใหม่
        const formmst =
          await this.formmstService.getFormMasterByVaname('IE-BGR');
        const createCond: CreateFormDto = {
          NFRMNO: formmst.NNO,
          VORGNO: formmst.VORGNO,
          CYEAR: formmst.CYEAR,
          REQBY: dto.empRequest,
          INPUTBY: dto.empInput,
          REMARK: dto.remark,
        };
        // 1.4 กรณีเป็น Draft ให้เพิ่มค่า Draft เข้าไป
        if (isDraft) {
          createCond.DRAFT = Draft;
        }
        const createForm = await this.formService.create(
          createCond,
          ip,
          queryRunner,
        );

        if (!createForm.status) {
          throw new Error(createForm.message.message);
        }

        form = {
          NFRMNO: createForm.data.NFRMNO,
          VORGNO: createForm.data.VORGNO,
          CYEAR: createForm.data.CYEAR,
          CYEAR2: createForm.data.CYEAR2,
          NRUNNO: createForm.data.NRUNNO,
        };
      }
      return form;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // สร้าง path สำหรับเก็บไฟล์
  async createPath(form: FormDto, path: string) {
    const formNo = await this.formService.getFormno(form); // Get the form number
    const destination = path + '/' + formNo; // Get the destination path
    return destination;
  }

  // Insert EBGREQFORM
  // prettier-ignore
  async insertEbgreqform({dto, queryRunner, form}: {dto: CreateIeBgrDto | DraftIeBgrDto, queryRunner?: QueryRunner, form: FormDto}) {
     try {
      const data = {
        ...form,
        ID: dto.BGTYPE,
        FYEAR: dto.FYEAR,
        SCATALOG: dto.SN,
        RECBG: dto.RECBG,
        USEDBG: dto.USEDBG,
        REMBG: dto.REMBG,
        REQAMT: dto.REQAMT,
        RESORG: dto.RESORG,
        PIC: dto.PIC,
        FINDATE: dto.FINDATE,
        ITMNAME: dto.ITMNAME,
        PURPOSE: dto.PURPOSE,
        DETPLAN: dto.DETPLAN,
        INVDET: dto.INVDET,
        EFFT: dto.EFFT,
        SCHEDULE: dto.SCHEDULE,
        REMARK: dto.REMARK,
        PPRESDATE: dto.PREDATE,
        GPBID: dto.GPBID || null,
        CASETYPE: dto.CASETYPE,
      };

      // Insert EBGREQFORM record
      return await this.ebudgetformService.upsert(data, queryRunner);
     }
     catch (error) {
      throw new Error(error.message);
     }
  }

  // จัดการไฟล์และรูปภาพ
  async insertFiles({
    isReturn,
    returnData,
    queryRunner,
    form,
    files,
    destination,
    movedTargets,
    returnDelFiles,
  }: {
    isReturn?: boolean;
    returnData?: BGRReturnDto;
    queryRunner?: QueryRunner;
    form: FormDto;
    files: Partial<Record<keyof typeof this.fileType, Express.Multer.File[]>>;
    destination: string;
    movedTargets: string[];
    returnDelFiles: string[];
  }) {
    try {
      if (isReturn) {
        // 1. ลบรูปภาพ
        if (returnData.delImage && returnData.delImage.length > 0) {
          let colno = [];
          for (const image of returnData.delImage) {
            const cond = {
              ...form,
              COLNO: Number(image.colno),
              ID: image.id,
            };
            const img = await this.ebudgetcolImageService.findOne(
              cond,
              queryRunner,
            );
            if (img) {
              returnDelFiles.push(await joinPaths(destination, img.SFILE)); // เตรียมลบไฟล์ที่มีอยู่เดิม
              await this.ebudgetcolImageService.delete(
                { condition: cond },
                queryRunner,
              ); // ลบข้อมูลรูปภาพใน DB
              colno.push(img.COLNO); // เก็บ colno ที่มีการลบไว้
            }
          }
          colno = [...new Set(colno)]; // เอา colno ที่ซ้ำออก
          for (const cn of colno) {
            // 2. เรียงลำดับ ID ใหม่
            const images = await this.ebudgetcolImageService.search(
              {
                ...form,
                COLNO: cn,
              },
              queryRunner,
            );
            const sortedImages = images.sort((a, b) => {
              const aNum = parseInt(a.ID);
              const bNum = parseInt(b.ID);
              return aNum - bNum;
            });
            let newId = 0;
            for (const img of sortedImages) {
              await this.ebudgetcolImageService.update(
                {
                  condition: {
                    ...form,
                    COLNO: cn,
                    ID: img.ID,
                  },
                  ID: String(++newId),
                },
                queryRunner,
              );
            }
          }
        }
        // 3. ลบไฟล์แนบ
        if (returnData.delattach && returnData.delattach.length > 0) {
          let typeno = [];
          for (const f of returnData.delattach) {
            const cond = {
              ...form,
              TYPENO: Number(f.typeno),
              ID: f.id,
            };
            const file = await this.ebudgetattfileService.findOne(
              cond,
              queryRunner,
            );
            if (file) {
              returnDelFiles.push(await joinPaths(destination, file.SFILE)); // เตรียมลบไฟล์ที่มีอยู่เดิม
              await this.ebudgetattfileService.delete(
                { condition: cond },
                queryRunner,
              ); // ลบข้อมูลรูปภาพใน DB
              typeno.push(file.TYPENO); // เก็บ typeno ที่มีการลบไว้
            }
          }
          typeno = [...new Set(typeno)]; // เอา typeno ที่ซ้ำออก
          for (const cn of typeno) {
            // 4. เรียงลำดับ ID ใหม่
            const files = await this.ebudgetattfileService.search(
              {
                ...form,
                TYPENO: cn,
              },
              queryRunner,
            );
            const sortedFiles = files.sort((a, b) => {
              const aNum = parseInt(a.ID);
              const bNum = parseInt(b.ID);
              return aNum - bNum;
            });
            let newId = 0;
            for (const file of sortedFiles) {
              await this.ebudgetattfileService.update(
                {
                  condition: {
                    ...form,
                    TYPENO: cn,
                    ID: file.ID,
                  },
                  ID: String(++newId),
                },
                queryRunner,
              );
            }
          }
        }
      }

      // 5. บันทึกไฟล์ และ รูปภาพ ลงในโฟลเดอร์ปลายทาง
      for (const key in files) {
        const raw = key.replace(/\[\]$/, '') as keyof typeof this.fileType; // รองรับกรณีที่ key เป็น array เช่น imageI[]
        const fileList = files[key];
        const data = key.startsWith('image')
          ? await this.ebudgetcolImageService.search(
              {
                ...form,
                COLNO: this.fileType[raw],
              },
              queryRunner,
            )
          : await this.ebudgetattfileService.search(
              {
                ...form,
                TYPENO: this.fileType[raw],
              },
              queryRunner,
            );
        let fileIndex = data.length; // เริ่มนับจากจำนวนไฟล์เดิม
        for (const file of fileList) {
          const moved = await moveFileFromMulter({file, destination});
          movedTargets.push(moved.path);
          movedTargets.push(file.path);
          // 6. บันทึกข้อมูลไฟล์ลงใน DB
          if (key.startsWith('image') && fileList) {
            await this.ebudgetcolImageService.insert(
              {
                ...form,
                COLNO: this.fileType[raw],
                ID: String(++fileIndex),
                IMAGE_FILE: file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'),
                SFILE: moved.newName,
              },
              queryRunner,
            );
          } else if (key.startsWith('file') && fileList) {
            await this.ebudgetattfileService.insert(
              {
                ...form,
                TYPENO: this.fileType[raw],
                ID: String(++fileIndex),
                SFILE: moved.newName,
                OFILE: file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'),
              },
              queryRunner,
            );
          }
        }
      }
      return { movedTargets, returnDelFiles };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // บันทึก Quotation และ Quotation Product
  async insertQuotations({
    isReturn,
    returnData,
    form,
    quotation = [],
    createBy,
    queryRunner,
  }: {
    isReturn: boolean;
    returnData: BGRReturnDto;
    form: FormDto;
    quotation: BGRQuotationDto[];
    createBy: string;
    queryRunner?: QueryRunner;
  }) {
    try {
      // 1. กรณี Return ให้ทำการยกเลิก Quotation รอบก่อนทั้งหมดเพราะค่าเงินอาจมีการเปลี่ยนแปลง หากอยากได้ revision ให้ order by DATE_UPDATE
      if (isReturn) {
        const oldQuotations = await this.ebudgetQuotationService.getData({
          ...form,
          STATUS: 1,
        });
        // const rejectQuotation = oldQuotations.filter(o => {
        //     return !dto.quotation.find(n => n.QTA_FORM === o.QTA_FORM);
        // })

        for (const r of oldQuotations) {
          await this.ebudgetQuotationService.update(
            {
              ID: r.ID,
              STATUS: 0,
              UPDATE_BY: returnData.EMPNO,
            },
            queryRunner,
          );
        }
      }
      // 2. บันทึก Quotation รอบใหม่
      for (const q of quotation) {
        const resQuo = await this.ebudgetQuotationService.insert(
          {
            ...form,
            QTA_FORM: q.QTA_FORM,
            QTA_VALID_DATE: q.QTA_VALID_DATE,
            TOTAL: q.TOTAL,
            CREATE_BY: createBy,
          },
          queryRunner,
        );
        // 3. บันทึกข้อมูล Quotation Product
        if (!q.product) continue;
        for (const product of q.product) {
          if (product.SEQ) {
            await this.ebudgetQuotationProductService.insert(
              {
                QUOTATION_ID: resQuo.data.ID,
                ...product,
              },
              queryRunner,
            );
          }
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
