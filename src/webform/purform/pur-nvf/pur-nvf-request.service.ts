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
import { deleteFile } from 'src/common/utils/files.utils';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UsersService } from 'src/amec/users/users.service';
import { PappflowService } from 'src/amec/pappflow/pappflow.service';


@Injectable()
export class PurNvfRequestService  {
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
        private readonly pappFlowService: PappflowService
    ) {}
  
    async request(
        dto: RequestPurnvfFormDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ

        try {
            const { REQBY, INPUTBY, REMARK, ...data } = dto;

            // 1. สร้าง Form ก่อน
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const user =  await this.usrService.findEmp(dto.REQBY);
            if (user && Object.keys(user).length > 0) {
              const slevel = user.SSECCODE !== "00" 
                ? user.SSECCODE 
                : (user.SDEPCODE && user.SDEPCODE !== "00" ? user.SDEPCODE : user.SDIVCODE);
              const pappflow = await this.pappFlowService.findFlowWithSteps(slevel, 35);
              if (pappflow && pappflow.length > 0 && pappflow[0].STEPS && pappflow[0].STEPS.length > 0) {
                const buyer = pappflow[0].STEPS[0].SEMPNO;
                const buyerrep = pappflow[0].STEPS[0].SEMPAPP;
                await this.flowService.updateFlow({
                            condition: {
                                NFRMNO: dto.NFRMNO,
                                VORGNO: dto.VORGNO,
                                CYEAR:  dto.CYEAR,
                                CYEAR2: createForm.data.CYEAR2,
                                NRUNNO: createForm.data.NRUNNO,
                                CEXTDATA: '02'
                            },
                                VAPVNO: buyer,
                                VREPNO: buyerrep,
                        });
            }
           }
           // throw new Error('Test Error After Create Form'); // - ทดสอบ error handling (ถ้า create form สำเร็จแล้ว จะเห็นว่ามีการลบไฟล์ที่ย้ายไปแล้วด้วย)
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };

            const datalist = 
            {
                LID : 1,
                PURPOSE : data.PURPOSE,
                TYPEJOB : data.TYPEJOB,
                SERVICE : data.SERVICE,
                VENDCODE : (data.REQTYPE === 'U' || data.REQTYPE === 'D') ? data.VENDORCODE:"",
                REASON : (data.REQTYPE === 'D') ? data.REASON:"",
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
            await this.repo.insert({
                ...form,
                REQTYPE: data.REQTYPE,
                ATTACH_TYPE: data.ATTACH_TYPE,
                ATTACH_OTHER: data.ATTACH_OTHER,
            });
            await this.repolst.insert({
                ...form,...datalist
                
            });
            for(const a of addr){
                await this.repoaddr.insert({
                    ...form,
                    ...a
                })
            }
            // 5. ย้ายไฟล์ไปยังปลายทางและ Insert ข้อมูลไฟล์ใหม่ (ถ้ามี)
            if (files && files.length > 0) {
                movedTargets = await this.moveFiles(
                    files,
                    form,
                    path,
                    dto.REQBY,
                );
            }
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




