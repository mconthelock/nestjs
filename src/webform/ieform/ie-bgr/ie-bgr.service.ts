import { Injectable } from '@nestjs/common';
import { CreateIeBgrDto } from './dto/create-ie-bgr.dto';
import { UpdateIeBgrDto } from './dto/update-ie-bgr.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FormService } from 'src/webform/form/form.service';
import { deleteFile, moveFileFromMulter } from 'src/common/utils/files.utils';
import { FormmstService } from 'src/webform/formmst/formmst.service';

@Injectable()
export class IeBgrService {
  constructor(
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private readonly formService: FormService,
    private readonly formmstService: FormmstService,
  ) {}
  async create(
    dto: CreateIeBgrDto,
    files: {
      imageI?: Express.Multer.File[];
      imageP?: Express.Multer.File[];
      imageD?: Express.Multer.File[];
      imageN?: Express.Multer.File[];
      imageE?: Express.Multer.File[];
      imageS?: Express.Multer.File[];
      fileP?: Express.Multer.File[];
      fileR?: Express.Multer.File[];
      fileS?: Express.Multer.File[];
      fileM?: Express.Multer.File[];
      fileE?: Express.Multer.File[];
      fileO?: Express.Multer.File[];
    },
    ip: string,
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    let movedTargets: string; // เก็บ path ปลายทางที่ย้ายสำเร็จ
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const formmst = await this.formmstService.getFormMasterByVaname('IE-BGR');
      console.log(formmst);
      

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

      console.log(createForm);

      if (!createForm.status) {
        throw new Error(createForm.message.message);
      }

      console.log('create form success');
      
      // 2. บันทึกข้อมูล EBGREQFORM
      const data = {
        NFRMNO: createForm.data.NFRMNO,
        VORGNO: createForm.data.VORGNO,
        CYEAR: createForm.data.CYEAR,
        CYEAR2: createForm.data.CYEAR2,
        NRUNNO: createForm.data.NRUNNO,
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
      console.log('data ' ,data);
      

      //   await this.insert(form, dto.data, queryRunner);

      //   // 3. ย้ายไฟล์ไปยังปลายทาง
      //   const formNo = await this.formService.getFormno(form); // Get the form number
      //   const destination = path + '/' + formNo; // Get the destination path
      //   const moved = await moveFileFromMulter(file, destination);
      //   movedTargets = moved.path;
      //   // 4. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
      //   await this.isFileService.insert(
      //     {
      //       ...form,
      //       FILE_ONAME: file.originalname,
      //       FILE_FNAME: moved.newName,
      //       FILE_USERCREATE: dto.REQUESTER,
      //       FILE_PATH: destination,
      //     },
      //     queryRunner,
      //   );
      throw new Error('test ');

      await queryRunner.commitTransaction();

      return {
        status: true,
        message: 'Request successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //   await deleteFile(movedTargets); // ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
      //   await deleteFile(file.path); // ลบไฟล์ใน tmp ออก
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
