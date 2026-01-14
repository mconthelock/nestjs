import { Injectable } from '@nestjs/common';
import { CreateIeBgrDto } from './dto/create-ie-bgr.dto';
import { UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import { deleteFile, moveFileFromMulter } from 'src/common/utils/files.utils';
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
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formmst = await this.formmstService.getFormMasterByVaname('IE-BGR');

      // 1. สร้าง Form ก่อน
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

      const form = {
        NFRMNO: createForm.data.NFRMNO,
        VORGNO: createForm.data.VORGNO,
        CYEAR: createForm.data.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
      };

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

      // 3. บันทึกไฟล์ และ รูปภาพ ลงในโฟลเดอร์ปลายทาง
      for (const key in files) {
        const raw = key.replace(/\[\]$/, '') as keyof typeof this.fileType; // รองรับกรณีที่ key เป็น array เช่น imageI[]
        const formNo = await this.formService.getFormno(form); // Get the form number
        const destination = path + '/' + formNo; // Get the destination path
        const fileList = files[key];
        let fileIndex = 0;
        for (const file of fileList) {
          const moved = await moveFileFromMulter(file, destination);
          movedTargets.push(moved.path);
          movedTargets.push(file.path);
          // 4. บันทึกข้อมูลไฟล์ลงใน DB
          if (key.startsWith('image') && fileList) {
            await this.ebudgetcolImageService.upsert(
              {
                ...form,
                COLNO: this.fileType[raw],
                ID: String(++fileIndex),
                IMAGE_FILE: file.originalname,
                SFILE: moved.newName,
              },
              queryRunner,
            );
          } else if (key.startsWith('file') && fileList) {
            await this.ebudgetattfileService.upsert(
              {
                ...form,
                TYPENO: this.fileType[raw],
                ID: String(++fileIndex),
                SFILE: moved.newName,
                OFILE: file.originalname,
              },
              queryRunner,
            );
          }
        }
      }

      // 5. บันทึกข้อมูล Quotation
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
        // 6. บันทึกข้อมูล Quotation Product
        for (const product of quotation.product) {
          await this.ebudgetQuotationProductService.insert(
            {
              QUOTATION_ID: resQuo.data.ID,
              ...product,
            },
            queryRunner,
          );
        }
      }

      // 7. ส่งเมลแจ้ง
      await this.flowService.sendMailToApprover(form, queryRunner);
      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      for (const filePath of movedTargets) {
        await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
      }
      return { status: false, message: 'Error: ' + error.message, dto };
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
      for ( const bidding of dto.pprbidding ){
        await this.pprbiddingService.create({
          SPRNO: bidding.SPRNO,
          BIDDINGNO: bidding.BIDDINGNO,
          EBUDGETNO: bidding.EBUDGETNO,
        }, queryRunner);
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
