import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);
import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { CreateFormmstDto } from './dto/create-formmst.dto';
import { UpdateFormmstDto } from './dto/update-formmst.dto';
import { CreateFormmstGroupDto } from './dto/create-formmst-group.dto';
import { UpdateFormmstGroupDto } from './dto/update-formmst-group.dto';
import { FormmstRepository } from './formmst.repository';

@Injectable()
export class FormmstService {
    constructor(private readonly repo: FormmstRepository) {}

    getFormMasterAll() {
        return this.repo.findAll();
    }

    getFormMasterByVaname(vaname: string) {
        return this.repo.findByVaname(vaname);
    }

    getFormMasterByVanameAll(vaname: string) {
        return this.repo.findByVanameAll(vaname);
    }

    async getFormmst(searchDto: SearchFormmstDto) {
        return this.repo.getFormmst(searchDto);
    }

    async getFormmstById(NNO: number, VORGNO: string, CYEAR: string) {
        try {
            const res = await this.repo.getFormmstById(NNO, VORGNO, CYEAR);
            if (res == null) {
                return {
                    status: false,
                    message: `Get Form master Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Get Form master data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Get Form master Error: ' + error.message);
        }
    }

    async createFormMaster(data: CreateFormmstDto) {
        const forms = await this.repo.getFormmst({
            VORGNO: data.VORGNO,
            CYEAR: dayjs().format('YY'),
        });
        const id =
            forms.length > 0 ? Math.max(...forms.map((f) => f.NNO)) + 1 : 1;
        data = {
            ...data,
            NNO: id,
            CYEAR: dayjs().format('YY'),
            NRUNNO: id,
            CSTATUS: '1',
        };
        const result = await this.repo.createFormMaster(data);
        return result;
    }

    async updateFormMaster(data: UpdateFormmstDto) {
        const forms = await this.repo.getFormmst({
            VORGNO: data.VORGNO,
            CYEAR: data.CYEAR,
            NNO: data.NNO,
        });
        if (forms.length === 0)
            throw new NotFoundException('Form master not found');
        return this.repo.updateFormMaster(data, {
            NNO: data.NNO,
            VORGNO: data.VORGNO,
            CYEAR: data.CYEAR,
        });
    }

    // Form master group methods
    async getAllGroup() {
        return this.repo.findAllGroup();
    }

    async createFormMasterGroup(data: CreateFormmstGroupDto) {
        const groups = await this.repo.findAllGroup();
        const maxGroupId = groups.filter((g) => {
            //console.log(g);
            return g.VGROUPORG === data.VGROUPORG;
        });
        data.VGROUP =
            maxGroupId.length > 0
                ? Math.max(...maxGroupId.map((g) => g.VGROUP)) + 1
                : 1;

        const result = await this.repo.createGroup(data);
        return result;
    }

    async updateFormMasterGroup(data: UpdateFormmstGroupDto) {
        return this.repo.updateGroup(data.VGROUPNAME, {
            VGROUPORG: data.VGROUPORG,
            VGROUP: data.VGROUP,
        });
    }
}
