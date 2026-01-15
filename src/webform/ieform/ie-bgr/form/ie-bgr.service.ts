import { Injectable } from '@nestjs/common';
import { CreateIeBgrDto } from './dto/create-ie-bgr.dto';
import { UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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

@Injectable()
export class IeBgrService {
  constructor(
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
    fileO: 6,
  } as const;

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

      let form: FormDto;
      // 1. ตรวจสอบกรณีเป็นการ Return
      if (dto.isReturn) {
        // 1.1 กรณี Return ให้ทำการ Do Action เลย
        form = {
          NFRMNO: dto.returnData.NFRMNO,
          VORGNO: dto.returnData.VORGNO,
          CYEAR: dto.returnData.CYEAR,
          CYEAR2: dto.returnData.CYEAR2,
          NRUNNO: dto.returnData.NRUNNO,
        };
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
      } else {
        // 1.2 กรณี New ให้สร้าง Form ใหม่
        const formmst =
          await this.formmstService.getFormMasterByVaname('IE-BGR');
        const createForm = await this.formService.create(
          {
            NFRMNO: formmst.NNO,
            VORGNO: formmst.VORGNO,
            CYEAR: formmst.CYEAR,
            REQBY: dto.empRequest,
            INPUTBY: dto.empInput,
            REMARK: dto.remark,
          },
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
      // 1.3 เตรียม path สำหรับบันทึกไฟล์
      const formNo = await this.formService.getFormno(form); // Get the form number
      const destination = path + '/' + formNo; // Get the destination path

      // 2. บันทึกข้อมูล EBGREQFORM
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
        GPBID: dto.GPBID,
        GPFYEAR: dto.GPYear,
      };

      // Insert EBGREQFORM record
      await this.ebudgetformService.upsert(data, queryRunner);

      // 3. จัดการไฟล์และรูปภาพ
      if (dto.isReturn) {
        // 3.1 ลบรูปภาพ
        if (dto.returnData.delImage && dto.returnData.delImage.length > 0) {
          let colno = [];
          for (const image of dto.returnData.delImage) {
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
            // 3.2 เรียงลำดับ ID ใหม่
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
        // 3.3 ลบไฟล์แนบ
        if (dto.returnData.delattach && dto.returnData.delattach.length > 0) {
          let typeno = [];
          for (const f of dto.returnData.delattach) {
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
            // 3.4 เรียงลำดับ ID ใหม่
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

      // 3.5 บันทึกไฟล์ และ รูปภาพ ลงในโฟลเดอร์ปลายทาง
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
          const moved = await moveFileFromMulter(file, destination);
          movedTargets.push(moved.path);
          movedTargets.push(file.path);
          // 3.6 บันทึกข้อมูลไฟล์ลงใน DB
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

      // 4. บันทึกข้อมูล Quotation

      if(dto.isReturn){
        // 4.1 กรณี Return ให้ทำการยกเลิก Quotation รอบก่อนทั้งหมดเพราะค่าเงินอาจมีการเปลี่ยนแปลง หากอยากได้ revision ให้ order by DATE_UPDATE
        const oldQuotations = await this.ebudgetQuotationService.getData({...form, STATUS: 1});
        // const rejectQuotation = oldQuotations.filter(o => {
        //     return !dto.quotation.find(n => n.QTA_FORM === o.QTA_FORM);
        // })
        
        for ( const r of oldQuotations ) {
            await this.ebudgetQuotationService.update({
                ID: r.ID,
                STATUS: 0,
                UPDATE_BY: dto.returnData.EMPNO
            }, queryRunner
            );
        }
      }
      for (const quotation of dto.quotation) {
        const resQuo = await this.ebudgetQuotationService.insert(
          {
            ...form,
            QTA_FORM: quotation.QTA_FORM,
            QTA_VALID_DATE: quotation.QTA_VALID_DATE,
            TOTAL: quotation.TOTAL,
            CREATE_BY: dto.empInput,
          },
          queryRunner,
        );
        // 5. บันทึกข้อมูล Quotation Product
        if(!quotation.product) continue;
        for (const product of quotation.product) {
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
}
