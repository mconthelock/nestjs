import { Injectable } from '@nestjs/common';
import { PurevaFormService } from './pureva_form/pureva_form.service';
import { RequestPurevaFormDto } from './dto/request-pur-eva.dto';
import { CreatePurevaFormDto } from './pureva_form/dto/create-pureva_form.dto';
import { PurevaFormRepository } from './pureva_form/pureva_form.repository';
import { PurevaProfitTurnoverService } from './pureva_profit_turnover/pureva_profit_turnover.service';
import { CreatePurevaProfitTurnoverDto } from './pureva_profit_turnover/dto/create-pureva_profit_turnover.dto';
import { PurevaProfitTurnoverRepository } from './pureva_profit_turnover/pureva_profit_turnover.repository';
import { PurevaScoreService } from './pureva_score/pureva_score.service';
import { CreatePurevaScoreDto } from './pureva_score/dto/create-pureva_score.dto';
import { PurevaScoreRepository } from './pureva_score/pureva_score.repository';
import { PurnvfAddressService } from '../pur-nvf/purnvf_address/purnvf_address.service';
import { CreatePurnvfAddressDto } from '../pur-nvf/purnvf_address/dto/create-purnvf_address.dto';
import { PurnvfAddressRepository } from '../pur-nvf/purnvf_address/purnvf_address.repository';  
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
import { PurevaVendorRelationService } from './pureva_vendor_relation/pureva_vendor_relation.service';


@Injectable()
export class PurEvaRequestService  {
    constructor(
        protected readonly repo: PurevaFormService,
        protected readonly repoaddr: PurnvfAddressRepository,
        protected readonly repoprofit: PurevaProfitTurnoverService,
        protected readonly reposcore:PurevaScoreService,
        protected readonly reporelation: PurevaVendorRelationService,
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
        dto: RequestPurevaFormDto,
        files: {'fileCer[]'?: Express.Multer.File[], 'fileVat[]'?: Express.Multer.File[] , 'fileIe[]'?: Express.Multer.File[] , 'fileQa[]'?: Express.Multer.File[], 'fileOther[]'?: Express.Multer.File[] }, // <--- เปลี่ยนตรงนี้
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
      const allFilesWithType = [
        ...(files['fileCer[]'] || []).map(file => ({ file, type: 11 })),
        ...(files['fileVat[]'] || []).map(file => ({ file, type: 12 })),
        ...(files['fileIe[]'] || []).map(file => ({ file, type: 13 })),
        ...(files['fileQa[]'] || []).map(file => ({ file, type: 14 })),
        ...(files['fileOther[]'] || []).map(file => ({ file, type: 2 })),
    ];
        

        try {
            const { REQBY, INPUTBY, REMARK, SCORES, PROFIT_TURNOVERS , RELATIONS , ...data } = dto;
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            const {  ADDRESS_EN , SUB_DISTRICT_EN , DISTRICT_EN , PROVINCE_EN , COUNTRY_EN , POSTCODE_EN  , ADDRESS_TH , SUB_DISTRICT_TH , DISTRICT_TH , PROVINCE_TH , COUNTRY_TH , POSTCODE_TH , ...purevadata } = data;
            const purevaForm = {
                ...form,
                ...purevadata
            };
            await this.repo.create(purevaForm);
            const addr = [];
            let addid = 0;
            if(ADDRESS_EN && ADDRESS_EN.trim().length > 0){
                addid++;
                addr.push({
                    ADDRID : addid,
                    ADDRTYPE : 'E',
                    ADDR : ADDRESS_EN,
                    SUBDISTRICT : SUB_DISTRICT_EN,
                    DISTRICT : DISTRICT_EN,
                    PROVINCE : PROVINCE_EN,
                    COUNTRY : COUNTRY_EN,
                    POSTCODE : POSTCODE_EN

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
            for(const a of addr){
                await this.repoaddr.insert({
                    ...form,
                    ...a
                })
            }
            await this.reposcore.createMultipleScores(form,SCORES);
            await this.repoprofit.createMultipleProfits(form,PROFIT_TURNOVERS);
            if (RELATIONS && RELATIONS.length > 0) {
                await this.reporelation.createMultipleRelations(form, RELATIONS);
            }
            if (allFilesWithType && allFilesWithType.length > 0) {
             movedTargets = await this.moveFiles(
                allFilesWithType, // ส่งตัวแปรที่รวบรวมไฟล์+type ไปแทน
                form, // (ต้องมีตัวแปร form ของคุณ)
                path,
                dto.REQBY,
            );
    }

        return {
                status: true,
                message: 'Request successful',
        };
        } catch (error) {
            const tmpFilePaths = allFilesWithType.map(item => item.file.path);
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...tmpFilePaths.map((f) => deleteFile(f)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Request PUR-EVA Form Error: ' + error.message);
        }
    }
    
    async moveFiles(
            filesList: { file: Express.Multer.File; type: number }[],
            form: FormDto,
            path: string,
            userCreate: string,
        ) {
            // 5. ย้ายไฟล์ไปยังปลายทาง
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = await joinPaths(path, formNo); // Get the destination path
            for (const item of filesList) {
                const file = item.file;
                const fileType = item.type;

                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                // 6. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
                await this.purFileService.insert({
                    ...form,
                    FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    FILE_USERCREATE: userCreate,
                    FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                    FILE_TYPE:fileType
                });
            }
            return movedTargets; // คืนรายชื่อไฟล์ที่ย้ายสำเร็จ (ถ้าต้องการ)
        }
        
   
     
}




