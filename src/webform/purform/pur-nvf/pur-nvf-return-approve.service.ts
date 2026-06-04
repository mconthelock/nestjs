import { Injectable } from '@nestjs/common';
import { PurnvfFormService } from './purnvf_form/purnvf_form.service';
import { RequestPurnvfFormDto } from './purnvf_form/dto/request-purnvf.dto';
import { CreatePurnvfFormDto } from './purnvf_form/dto/create-purnvf_form.dto';
import { PurnvfFormRepository } from './purnvf_form/purnvf_form.repository';
import { PurnvfListService } from './purnvf_list/purnvf_list.service';
import { CreatePurnvfListDto } from './purnvf_list/dto/create-purnvf_list.dto';
import { PurnvfListRepository } from './purnvf_list/purnvf_list.repository';
import { PurnvfAddressService } from './purnvf_address/purnvf_address.service';
import { CreatePurnvfAddressDto } from './purnvf_address/dto/create-purnvf_address.dto';
import { PurnvfAddressRepository } from './purnvf_address/purnvf_address.repository';   
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { PurFileService } from '../pur-file/pur-file.service';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { deleteFile  } from 'src/common/utils/files.utils';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UsersService } from 'src/amec/users/users.service';
import { PappflowService } from 'src/amec/pappflow/pappflow.service';
import { PurnvfReturnArppoveDto } from './purnvf_form/dto/request-purnvf.dto';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';


@Injectable()
export class PurNvfReturnApproveService  {
    constructor(
        protected readonly repo: PurnvfFormRepository,
        protected readonly repolst: PurnvfListRepository,
        protected readonly repoaddr: PurnvfAddressRepository,
        protected readonly formService: FormService,
        protected readonly flowService: FlowService,
        protected readonly formmstService: FormmstService,
        protected readonly purFileService: PurFileService,
        protected readonly repService: RepService,
        protected readonly deleteFlowStepService: DeleteFlowStepService,
        protected readonly insertFlowStepService: InsertFlowStepService,
        private readonly formCreateService: FormCreateService,
        private readonly usrService: UsersService,
        private readonly pappFlowService: PappflowService,
        private readonly doactionService: DoactionFlowService,
    ) {}
  
    async returnApprove(
        dto: PurnvfReturnArppoveDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ

        try {
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ACTION, EMPNO, REMARK, DELETE_FILES, ...data } = dto;
            const form = {
                NFRMNO: NFRMNO,
                VORGNO: VORGNO,
                CYEAR: CYEAR,
                CYEAR2: CYEAR2,
                NRUNNO: NRUNNO,
            };   


            const datalist = 
            {
                LID : 1,
                PURPOSE : data.PURPOSE,
                TYPEJOB : data.TYPEJOB,
                SERVICE : data.SERVICE,
                VENDTYPE : data.VENDOR_LOCATION,
                COMNAME : data.COMPANY_NAME,
                CONTACT : data.CONTACT,
                EMAIL : data.EMAIL,
                WEBSITE : data.WEBSITE,
                TELNO : data.TELNO,
                FAX : data.FAX,
                BANKNAME : data.BANKNAME,
                BRANCH : data.BRANCH,
                ACCNUMBER : data.ACCNUMBER,
                TERMCODE : data.TERMCODE
            }
            const addr = [];
            let addid = 0;
            if(data.ADDRESS_EN && data.ADDRESS_EN.trim().length > 0){
                addid++;
                addr.push({
                    ADDRID : addid,
                    ADDRTYPE : 'E',
                    ADDR : data.ADDRESS_EN,
                    SUBDISTRICT : data.SUB_DISTRICT_EN,
                    DISTRICT : data.DISTRICT_EN,
                    PROVINCE : data.PROVINCE_EN,
                    COUNTRY : data.COUNTRY_EN,
                    POSTCODE : data.POSTCODE_EN

                })
            }
            if(data.ADDRESS_TH && data.ADDRESS_TH.trim().length > 0){
                addid++;
                addr.push({
                    ADDRID : addid,
                    ADDRTYPE : 'T',
                    ADDR : data.ADDRESS_TH,
                    SUBDISTRICT : data.SUB_DISTRICT_TH,
                    DISTRICT : data.DISTRICT_TH,
                    PROVINCE : data.PROVINCE_TH,
                    COUNTRY : data.COUNTRY_TH,
                    POSTCODE : data.POSTCODE_TH
                })
            }

            // 4. บันทึกข้อมูล PUR-NVF form
            await this.repo.updateById({
                ...form,
                REQTYPE: data.REQTYPE,
                ATTACH_TYPE: data.ATTACH_TYPE,
                ATTACH_OTHER: data.ATTACH_OTHER,
            });
            await this.repolst.deleteByAll({...form});
            await this.repolst.insert({
                ...form,...datalist
                
            });
            await this.repoaddr.deleteByAll({...form});
            for(const a of addr){
                await this.repoaddr.insert({
                    ...form,
                    ...a
                })
            }
        
            // 7. ลบไฟล์ที่ถูกระบุให้ลบ (ถ้ามี)
            if (DELETE_FILES && DELETE_FILES.length > 0) {
                for (const id of DELETE_FILES) {
                    const file = await this.purFileService.getFileById(+id);
                    await this.purFileService.deleteFileByID(+id);
                    const destination = await joinPaths(
                        file.FILE_PATH,
                        file.FILE_FNAME,
                    );
                    await deleteFile(destination);
                }
            }

            // 8. ย้ายไฟล์ไปยังปลายทางและ Insert ข้อมูลไฟล์ใหม่ (ถ้ามี)
            if (files && files.length > 0) {
                movedTargets = await this.moveFiles(files, form, path, EMPNO);
            }

            // 9. ส่ง action 'approve' เพื่ออนุมัติคำขอกลับไปยังหัวหน้า (หรือผู้อนุมัติคนถัดไป) โดยไม่ต้องเช็คเงื่อนไขใดๆ เพิ่มเติม เพราะถือว่าการเปลี่ยนแปลง flow และการอัพเดตข้อมูลเสร็จสมบูรณ์แล้ว
            await this.doactionService.doAction(
                { ...form, ACTION: 'approve', EMPNO, REMARK },
                ip,
            );
            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Request PUR-NVF Form Error: ' + error.message);
        }
    }
    
    async moveFiles(
            files: Express.Multer.File[],
            form: FormDto,
            path: string,
            userCreate: string,
        ) {
            // 5. ย้ายไฟล์ไปยังปลายทาง
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = await joinPaths(path, formNo); // Get the destination path
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                // 6. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
                await this.purFileService.insert({
                    ...form,
                    FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    FILE_USERCREATE: userCreate,
                    FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                });
            }
            return movedTargets; // คืนรายชื่อไฟล์ที่ย้ายสำเร็จ (ถ้าต้องการ)
        }
        
   
     
}




