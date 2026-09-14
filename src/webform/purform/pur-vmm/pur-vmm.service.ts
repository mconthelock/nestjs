import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePurVmmDto } from './dto/create-pur-vmm.dto';
import { UpdatePurVmmDto } from './dto/update-pur-vmm.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurevaFormService } from '../pur-eva/pureva_form/pureva_form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormService } from 'src/webform/form/form.service';
import { PurvmmFormService } from './purvmm_form/purvmm_form.service';
import { PurnvfAddressRepository } from '../pur-nvf/purnvf_address/purnvf_address.repository';
import { PurvmmFormRepository } from '../pur-vmm/purvmm_form/purvmm_form.repository';
import { PurvmmScmusrService } from './purvmm_scmusr/purvmm_scmusr.service';
import { PurvmmScmuserRepository } from './purvmm_scmusr/purvmm_scmusr.repository';
import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { PurFileService } from '../pur-file/pur-file.service';
import {
    copyFile,
    deleteFile,
    joinPaths,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { log } from 'console';
import { RequestPurvmmFormDto } from './dto/request-pur-vmm.dto';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { ApprovePurVmmDto } from './dto/update-pur-vmm.dto';
import { AmecUserAllService } from 'src/amec/amecuserall/amecuserall.service';

@Injectable()
export class PurVmmService {
    constructor(
        protected readonly repoeva: PurevaFormService,
        protected readonly repomst: FormmstService,
        protected readonly formService: FormService,
        protected readonly formcreateservice: FormCreateService,
        protected readonly repovmmfrm: PurvmmFormService,
        protected readonly repaddr: PurnvfAddressRepository,
        private readonly vmmrepo: PurvmmFormRepository,
        private readonly purFileService: PurFileService,
        private readonly reposcmuser: PurvmmScmuserRepository,
        private readonly scmuserService: PurvmmScmusrService,
        private readonly doactionService: DoactionFlowService,
        private readonly mailService: MailService,
        private readonly userService: AmecUserAllService,

        @InjectRepository(Vendors, 'purConnection')
        private readonly vnd: Repository<Vendors>,
    ) {}

    async createauto(formEva: FormDto, ip: string, path: string) {
        const formvmnno = await this.repomst.getFormMasterByVaname('PUR-VMM');
        const formreqeva = await this.formService.getFormData(formEva);
        const formevano = await this.formService.getFormno(formEva);
        const dataeva = await this.repoeva.getData(formEva);
        const formvmm = await this.formcreateservice.create(
            {
                NFRMNO: formvmnno.NNO,
                VORGNO: formvmnno.VORGNO,
                CYEAR: formvmnno.CYEAR,
                REQBY: formreqeva.VREQNO,
                INPUTBY: formreqeva.VINPUTER,
                DRAFT: '1',
            },
            ip,
        );
        const form = {
            NFRMNO: formvmnno.NNO,
            VORGNO: formvmnno.VORGNO,
            CYEAR: formvmnno.CYEAR,
            CYEAR2: formvmm.data.CYEAR2,
            NRUNNO: formvmm.data.NRUNNO,
        };
        const datavmmfrm = {
            ...form,
            REQTYPE: dataeva.OPERATION === 'N' ? 'A' : 'U',
            VENDCODE: dataeva.VENDCODE,
            VENDNAME: dataeva.COMNAME,
            VENDGROUPTYPE:
                dataeva.VENDGROUP === '6:Non-Production (6)'
                    ? 'Indirect'
                    : dataeva.VENDGROUP === '8:Sub-Contractor (8)'
                      ? 'Subcon'
                      : 'Direct',
            VENDCAT: dataeva.VENDCAT,
            TAXID: dataeva.TAX_ID,
            CURCODE: dataeva.CURCODE,
            TERMCODE: dataeva.TERMCODE,
            VNALPH: dataeva.COMNAME.slice(0, 10),
            VPAYTO: dataeva.VENDCODE,
            CONTACT: dataeva.CONTACT,
            EMAIL: dataeva.EMAIL,
            WEBSITE: dataeva.WEBSITE,
            TELNO: dataeva.TELNO,
            FAX: dataeva.FAX,
            ACCNUMBER: dataeva.ACCNUMBER,
            BANKNAME: dataeva.BANKNAME,
            BRANCH: dataeva.BRANCH,
            BANKADDR: dataeva.BANKADDR,
            ATTACH_OTHER: dataeva.ATTACH_OTHER,
            EVANO: formevano,
        };
        try {
            const res = await this.repovmmfrm.create(datavmmfrm);

            if (dataeva.ADDRESSES && Array.isArray(dataeva.ADDRESSES)) {
                for (const item of dataeva.ADDRESSES) {
                    const addressDto = {
                        ...form,
                        ADDRID: item.ADDRID,
                        ADDRTYPE: item.ADDRTYPE,
                        ADDR1: item.ADDR1,
                        ADDR2: item.ADDR2,
                        CITY: item.CITY,
                        STATE: item.STATE,
                        COUNTRY: item.COUNTRY,
                        POSTCODE: item.POSTCODE,
                    };
                    await this.repaddr.create(addressDto);
                }
            }

            const fs = await this.purFileService.getFile(formEva);
            if (fs && Array.isArray(fs)) {
                for (const f of fs) {
                    const formNo = await this.formService.getFormno(form); // Get the form number
                    const destination = await joinPaths(path, formNo); // Get the destination path
                    console.log('destination', destination);
                    //throw new Error(destination);
                    if (f.FILE_TYPE == 11 || f.FILE_TYPE == 2) {
                        await copyFile(
                            await joinPaths(f.FILE_PATH, f.FILE_FNAME),
                            destination,
                        );
                        await this.purFileService.insert({
                            ...form,
                            FILE_ONAME: f.FILE_ONAME, // ชื่อเดิมฝั่ง client
                            FILE_FNAME: f.FILE_FNAME, // ชื่อไฟล์ที่ใช้เก็บจริง
                            FILE_USERCREATE: f.FILE_USERCREATE,
                            FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                            FILE_TYPE: f.FILE_TYPE,
                        });
                    }
                }
            }
        } catch (error) {
            throw new Error('Create PUR-VMM auto : ' + error.message);
        }

        return {
            formvmnno,
            formreqeva,
            dataeva,
            formvmm,
        };
    }

    async request(
        dto: RequestPurvmmFormDto,
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        }, // <--- เปลี่ยนตรงนี้
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        const allFilesWithType = [
            ...(files['fileCer[]'] || []).map((file) => ({ file, type: 11 })),
            ...(files['fileOther[]'] || []).map((file) => ({ file, type: 2 })),
        ];

        try {
            const { REQBY, INPUTBY, DRAFT, REMARK, SCMUSER, ...data } = dto;
            const createForm = await this.formcreateservice.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(DRAFT !== undefined && { DRAFT: DRAFT }),
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
            const {
                ADDRESS1_EN,
                ADDRESS2_EN,
                CITY_EN,
                STATE_EN,
                COUNTRY_EN,
                POSTCODE_EN,
                ADDRESS_TH,
                ...purvmmdata
            } = data;
            const purvmmForm = {
                ...form,
                ...purvmmdata,
            };

            await this.repovmmfrm.create(purvmmForm);
            const addr = [];
            let addid = 0;
            if (ADDRESS1_EN && ADDRESS1_EN.trim().length > 0) {
                addid++;
                addr.push({
                    ADDRID: addid,
                    ADDRTYPE: 'E',
                    ADDR1: ADDRESS1_EN,
                    ADDR2: ADDRESS2_EN,
                    CITY: CITY_EN,
                    STATE: STATE_EN,
                    COUNTRY: COUNTRY_EN,
                    POSTCODE: POSTCODE_EN,
                });
            }
            if (data.ADDRESS_TH && data.ADDRESS_TH.trim().length > 0) {
                addid++;
                addr.push({
                    ADDRID: addid,
                    ADDRTYPE: 'T',
                    ADDR1: data.ADDRESS_TH,
                });
            }
            for (const a of addr) {
                await this.repaddr.insert({
                    ...form,
                    ...a,
                });
            }

            if (SCMUSER && SCMUSER.length > 0) {
                //wait this.reposcmuser.InsertUsers(SCMUSER);
                await this.scmuserService.createMultipleUsers(form, SCMUSER);
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
            const tmpFilePaths = allFilesWithType.map((item) => item.file.path);
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...tmpFilePaths.map((f) => deleteFile(f)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Request PUR-VMM Form Error: ' + error.message);
        }
    }

    async update(
        dto: UpdatePurVmmDto,
        files: {
            'fileCer[]'?: Express.Multer.File[];
            'fileOther[]'?: Express.Multer.File[];
        }, // <--- เปลี่ยนตรงนี้
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        const allFilesWithType = [
            ...(files['fileCer[]'] || []).map((file) => ({ file, type: 11 })),
            ...(files['fileOther[]'] || []).map((file) => ({ file, type: 2 })),
        ];

        try {
            const {
                REQBY,
                INPUTBY,
                DRAFT,
                REMARK,
                ACTION,
                EMPNO,
                SCMUSER,
                DELETE_FILES,
                ...data
            } = dto;
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: data.CYEAR2,
                NRUNNO: data.NRUNNO,
            };
            const {
                ADDRESS1_EN,
                ADDRESS2_EN,
                CITY_EN,
                STATE_EN,
                COUNTRY_EN,
                POSTCODE_EN,
                ADDRESS_TH,
                ...purvmmdata
            } = data;
            // const purvmmForm = {
            //     ...form,
            //     ...purvmmdata,
            // };
            //console.log(purvmmdata);
            //return false;

            await this.vmmrepo.update(form, purvmmdata);
            const addr = [];
            let addid = 0;
            if (ADDRESS1_EN && ADDRESS1_EN.trim().length > 0) {
                addid++;
                addr.push({
                    ADDRID: addid,
                    ADDRTYPE: 'E',
                    ADDR1: ADDRESS1_EN,
                    ADDR2: ADDRESS2_EN,
                    CITY: CITY_EN,
                    STATE: STATE_EN,
                    COUNTRY: COUNTRY_EN,
                    POSTCODE: POSTCODE_EN,
                });
            }
            if (data.ADDRESS_TH && data.ADDRESS_TH.trim().length > 0) {
                addid++;
                addr.push({
                    ADDRID: addid,
                    ADDRTYPE: 'T',
                    ADDR1: data.ADDRESS_TH,
                });
            }
            await this.repaddr.deleteByAll(form);
            for (const a of addr) {
                await this.repaddr.insert({
                    ...form,
                    ...a,
                });
            }

            await this.reposcmuser.deleteByAll(form);
            if (SCMUSER && SCMUSER.length > 0) {
                await this.scmuserService.createMultipleUsers(form, SCMUSER);
            }

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
            if (allFilesWithType && allFilesWithType.length > 0) {
                movedTargets = await this.moveFiles(
                    allFilesWithType, // ส่งตัวแปรที่รวบรวมไฟล์+type ไปแทน
                    form, // (ต้องมีตัวแปร form ของคุณ)
                    path,
                    dto.REQBY,
                );
            }

            if (ACTION == 'approve') {
                await this.formService.updateForm({
                    condition: { ...form },
                    CST: '1',
                });
                await this.doactionService.doAction(
                    { ...form, ACTION: ACTION, EMPNO, REMARK },
                    ip,
                );
            }

            return {
                status: true,
                message: 'Update PUR-VMM Form successful',
            };
        } catch (error) {
            const tmpFilePaths = allFilesWithType.map((item) => item.file.path);
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...tmpFilePaths.map((f) => deleteFile(f)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Update PUR-VMM Form Error: ' + error.message);
        }
    }

    async approve(dto: ApprovePurVmmDto, ip: string) {
        const { REMARK, ACTION, EMPNO, ...data } = dto;
        const form = {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: data.CYEAR2,
            NRUNNO: data.NRUNNO,
        };
        // console.log(form);
        // console.log(data);
        // console.log(dto);
        // return false;
        try {
            await this.doactionService.doAction(
                { ...form, ACTION: ACTION, EMPNO, REMARK },
                ip,
            );
            const cst = await this.formService.getFormStatus({ ...form });
            if (cst == '2') {
                const subject = 'VENDOR MASTER MAINTENANCE';
                //  const to = "Accounting@MitsubishiElevatorAsia.co.th";
                const to = 'kanittha@MitsubishiElevatorAsia.co.th';
                let cc = '';
                if (data.VENDGROUPTYPE == 'Direct') {
                    if (data.REQTYPE == 'Add') {
                        cc = '';
                    } else if (data.REQTYPE == 'Update') {
                        cc = 'SPU_BUYER SPU_BUYER@mitsubishielevatorasia.co.th';
                    } else {
                        cc = 'SPU_BUYER@mitsubishielevatorasia.co.th';
                    }
                } else if (data.VENDGROUPTYPE == 'Indirect') {
                    cc = 'PADmember@MitsubishiElevatorAsia.co.th';
                } else {
                    cc = 'SCmember@MitsubishiElevatorAsia.co.th';
                }
            }

            return {
                status: true,
                message: 'Approve PUR-VMM Form successful',
            };
        } catch (error) {
            throw new Error('Approve PUR-VMM Form Error: ' + error.message);
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
                FILE_TYPE: fileType,
            });
        }
        return movedTargets; // คืนรายชื่อไฟล์ที่ย้ายสำเร็จ (ถ้าต้องการ)
    }

    create(dto: CreatePurVmmDto) {
        return `This action returns all purVmm`;
    }

    findAll() {
        return `This action returns all purVmm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} purVmm`;
    }

    remove(id: number) {
        return `This action removes a #${id} purVmm`;
    }

    async initForm() {
        const vendors = await this.vnd.find({ where: { VND_CODE: '60533' } });
        const formvmnno = await this.repomst.getFormMasterByVaname('PUR-VMM');

        for (const vendor of vendors) {
            const formvmm = await this.formcreateservice.create(
                {
                    NFRMNO: formvmnno.NNO,
                    VORGNO: formvmnno.VORGNO,
                    CYEAR: formvmnno.CYEAR,
                    REQBY: '08035',
                    INPUTBY: '08035',
                },
                '::1',
            );
            const form = {
                NFRMNO: formvmnno.NNO,
                VORGNO: formvmnno.VORGNO,
                CYEAR: formvmnno.CYEAR,
                CYEAR2: formvmm.data.CYEAR2,
                NRUNNO: formvmm.data.NRUNNO,
            };

            const datavmmfrm = {
                ...form,
                REQTYPE: 'U',
                VENDCODE: vendor.VND_CODE,
                VENDNAME: vendor.VND_NAME,
                VENDGROUPTYPE: vendor.VND_TYPE1 == '1' ? 'Direct' : 'Indirect',
            };
            await this.vmmrepo.create(datavmmfrm);
            const addressDto = {
                ...form,
                ADDRID: 1,
                ADDRTYPE: 'E',
                ADDR1: vendor.VND_ADDRESS1,
                ADDR2: vendor.VND_ADDRESS2,
                CITY: vendor.VND_CITY,
                STATE: vendor.VND_STATE,
                COUNTRY: vendor.VND_COUNTRY,
                POSTCODE: '',
            };
            await this.repaddr.create(addressDto);
        }

        return vendors;
    }
}
