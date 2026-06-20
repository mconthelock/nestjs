import { Injectable } from '@nestjs/common';
import { FinpckFormRepository } from './finpck_form/finpck_form.repository';
import { FinpckAssetRepository } from './finpck_asset/finpck_asset.repository';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { UsersService } from 'src/amec/users/users.service';
import { PappflowService } from 'src/amec/pappflow/pappflow.service';
import { RequestFinpckFormDto } from './dto/request-fin-pck.dto';
import { UpdateFinPckDto } from './dto/update-fin-pck.dto';


@Injectable()
export class FinPckService {
  constructor(
        private readonly formRepo: FinpckFormRepository,
        private readonly assetRepo: FinpckAssetRepository,
         protected readonly formService: FormService ,
         protected readonly flowService: FlowService,
         protected readonly formmstService: FormmstService,
         protected readonly repService: RepService,
         protected readonly deleteFlowStepService: DeleteFlowStepService,
         protected readonly insertFlowStepService: InsertFlowStepService,
         private readonly formCreateService: FormCreateService,
         private readonly usrService: UsersService,
         private readonly pappFlowService: PappflowService
     ) {}
   
     async request(
         dto: RequestFinpckFormDto,
         ip: string,
     ) {
         try {
             const { formData, groupedData } = dto;

             const { REQBY, INPUTBY, REMARK, ...data } = formData;
 
             // 1. สร้าง Form ก่อน
             const createForm = await this.formCreateService.create(
                 {
                     NFRMNO: data.NFRMNO,
                     VORGNO: data.VORGNO,
                     CYEAR:  data.CYEAR,
                     REQBY:  REQBY,
                     INPUTBY: INPUTBY,
                     REMARK: REMARK,
                 },
                 ip,
             );
             if (!createForm.status) {
                 throw new Error(createForm.message.message);
             }
            //  const user =  await this.usrService.findEmp(REQBY);
            //  if (user && Object.keys(user).length > 0) {
            //    const slevel = user.SSECCODE !== "00" 
            //      ? user.SSECCODE 
            //      : (user.SDEPCODE && user.SDEPCODE !== "00" ? user.SDEPCODE : user.SDIVCODE);
            //    const pappflow = await this.pappFlowService.findFlowWithSteps(slevel, 35);
            //    if (pappflow && pappflow.length > 0 && pappflow[0].STEPS && pappflow[0].STEPS.length > 0) {
            //      const buyer = pappflow[0].STEPS[0].SEMPNO;
            //      const buyerrep = pappflow[0].STEPS[0].SEMPAPP;
            //      await this.flowService.updateFlow({
            //                  condition: {
            //                      NFRMNO: dto.NFRMNO,
            //                      VORGNO: dto.VORGNO,
            //                      CYEAR:  dto.CYEAR,
            //                      CYEAR2: createForm.data.CYEAR2,
            //                      NRUNNO: createForm.data.NRUNNO,
            //                      CEXTDATA: '02'
            //                  },
            //                      VAPVNO: buyer,
            //                      VREPNO: buyerrep,
            //              });
            //  }
            // }
            // // throw new Error('Test Error After Create Form'); // - ทดสอบ error handling (ถ้า create form สำเร็จแล้ว จะเห็นว่ามีการลบไฟล์ที่ย้ายไปแล้วด้วย)
            //  const form = {
            //      NFRMNO: dto.NFRMNO,
            //      VORGNO: dto.VORGNO,
            //      CYEAR: dto.CYEAR,
            //      CYEAR2: createForm.data.CYEAR2,
            //      NRUNNO: createForm.data.NRUNNO,
            //  };
 
            //  const datalist = 
            //  {
            //      LID : 1,
            //      PURPOSE : data.PURPOSE,
            //      TYPEJOB : data.TYPEJOB,
            //      SERVICE : data.SERVICE,
            //      VENDCODE : (data.REQTYPE === 'U' || data.REQTYPE === 'D') ? data.VENDORCODE:"",
            //      REASON : (data.REQTYPE === 'D') ? data.REASON:"",
            //      VENDTYPE : data.VENDOR_LOCATION,
            //      COMNAME : data.COMPANY_NAME,
            //      CONTACT : data.CONTACT,
            //      EMAIL : data.EMAIL,
            //      WEBSITE : data.WEBSITE,
            //      TELNO : data.TELNO,
            //      FAX : data.FAX,
            //      BANKNAME : data.BANKNAME,
            //      BRANCH : data.BRANCH,
            //      ACCNUMBER : data.ACCNUMBER,
            //      TERMCODE : data.TERMCODE
            //  }
            //  const addr = [];
            //  let addid = 0;
            //  if(data.ADDRESS_EN && data.ADDRESS_EN.trim().length > 0){
            //      addid++;
            //      addr.push({
            //          ADDRID : addid,
            //          ADDRTYPE : 'E',
            //          ADDR : data.ADDRESS_EN,
            //          SUBDISTRICT : data.SUB_DISTRICT_EN,
            //          DISTRICT : data.DISTRICT_EN,
            //          PROVINCE : data.PROVINCE_EN,
            //          COUNTRY : data.COUNTRY_EN,
            //          POSTCODE : data.POSTCODE_EN
 
            //      })
            //  }
            //  if(data.ADDRESS_TH && data.ADDRESS_TH.trim().length > 0){
            //      addid++;
            //      addr.push({
            //          ADDRID : addid,
            //          ADDRTYPE : 'T',
            //          ADDR : data.ADDRESS_TH,
            //          SUBDISTRICT : data.SUB_DISTRICT_TH,
            //          DISTRICT : data.DISTRICT_TH,
            //          PROVINCE : data.PROVINCE_TH,
            //          COUNTRY : data.COUNTRY_TH,
            //          POSTCODE : data.POSTCODE_TH
            //      })
            //  }
 
            //  // 4. บันทึกข้อมูล PUR-NVF form
            //  await this.repo.insert({
            //      ...form,
            //      REQTYPE: data.REQTYPE,
            //      ATTACH_TYPE: data.ATTACH_TYPE,
            //      ATTACH_OTHER: data.ATTACH_OTHER,
            //  });
            //  await this.repolst.insert({
            //      ...form,...datalist
                 
            //  });
            //  for(const a of addr){
            //      await this.repoaddr.insert({
            //          ...form,
            //          ...a
            //      })
            //  }
            //  // 5. ย้ายไฟล์ไปยังปลายทางและ Insert ข้อมูลไฟล์ใหม่ (ถ้ามี)
            //  if (files && files.length > 0) {
            //      movedTargets = await this.moveFiles(
            //          files,
            //          form,
            //          path,
            //          dto.REQBY,
            //      );
            //  }
             return {
                 status: true,
                 message: 'Request successful',
             };
         } catch (error) {
      
             throw new Error('Request FIN-PCK Form Error: ' + error.message);
         }
     }
 


  findAll() {
    return `This action returns all finPck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finPck`;
  }

  update(id: number, updateFinPckDto: UpdateFinPckDto) {
    return `This action updates a #${id} finPck`;
  }

  remove(id: number) {
    return `This action removes a #${id} finPck`;
  }
}
