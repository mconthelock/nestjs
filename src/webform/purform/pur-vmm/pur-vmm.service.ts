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

        @InjectRepository(Vendors, 'purConnection')
        private readonly vnd: Repository<Vendors>,
    ) {}

    async createauto(formEva: FormDto, ip: string) {
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
            ACCNUMBER: dataeva.ACCNUMBER,
            BANKNAME: dataeva.BANKNAME,
            BRANCH: dataeva.BRANCH,
        };
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
        const vendors = await this.vnd.find({ where: { VND_STATUS: '1' } });
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
            const res = await this.vmmrepo.create(datavmmfrm);
        }

        return vendors;
    }
}
