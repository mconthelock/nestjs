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
import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { PurFileService } from '../pur-file/pur-file.service';
import { copyFile, joinPaths } from 'src/common/utils/files.utils';
import { log } from 'console';

@Injectable()
export class PurVmmService {
    constructor(
        protected readonly repoeva: PurevaFormService,
        protected readonly repomst: FormmstService,
        protected readonly formservice: FormService,
        protected readonly formcreateservice: FormCreateService,
        protected readonly repovmmfrm: PurvmmFormService,
        protected readonly repaddr: PurnvfAddressRepository,
        private readonly vmmrepo: PurvmmFormRepository,
        private readonly filesv: PurFileService,

        @InjectRepository(Vendors, 'purConnection')
        private readonly vnd: Repository<Vendors>,
    ) {}

    async createauto(formEva: FormDto, ip: string, path: string) {
        const formvmnno = await this.repomst.getFormMasterByVaname('PUR-VMM');
        const formreqeva = await this.formservice.getFormData(formEva);
        const dataeva = await this.repoeva.getData(formEva);
        const formvmm = await this.formcreateservice.create(
            {
                NFRMNO: formvmnno.NNO,
                VORGNO: formvmnno.VORGNO,
                CYEAR: formvmnno.CYEAR,
                REQBY: formreqeva.VREQNO,
                INPUTBY: formreqeva.VINPUTER,
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
                    : 'Direct',
            TAXID: dataeva.TAX_ID,
            CURCODE: dataeva.CURCODE,
            TERMCODE: dataeva.TERMCODE,
            VNALPH: dataeva.COMNAME.slice(0, 10),
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

            const fs = await this.filesv.getFile(formEva);
            if (fs && Array.isArray(fs)) {
                for (const f of fs) {
                    const formNo = await this.formservice.getFormno(form); // Get the form number
                    const destination = await joinPaths(path, formNo); // Get the destination path
                    //throw new Error(destination);
                    await copyFile(f.FILE_PATH, destination);
                    await this.filesv.insert({
                        ...form,
                        FILE_ONAME: f.FILE_ONAME, // ชื่อเดิมฝั่ง client
                        FILE_FNAME: f.FILE_FNAME, // ชื่อไฟล์ที่ใช้เก็บจริง
                        FILE_USERCREATE: f.FILE_USERCREATE,
                        FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                        FILE_TYPE: f.FILE_TYPE,
                    });
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

    create(dto: CreatePurVmmDto) {
        return `This action returns all purVmm`;
    }

    findAll() {
        return `This action returns all purVmm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} purVmm`;
    }

    update(id: number, updatePurVmmDto: UpdatePurVmmDto) {
        return `This action updates a #${id} purVmm`;
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
