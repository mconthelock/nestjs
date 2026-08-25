import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);
import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { CreateFormmstDto } from './dto/create-formmst.dto';
import { UpdateFormmstDto } from './dto/update-formmst.dto';
import { CreateFormmstGroupDto } from './dto/create-formmst-group.dto';
import { UpdateFormmstGroupDto } from './dto/update-formmst-group.dto';
import { FormmstRepository } from './formmst.repository';
import { UsersService } from 'src/amec/users/users.service';

@Injectable()
export class FormmstService {
    constructor(
        private readonly repo: FormmstRepository,
        private usr: UsersService,
    ) {}

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

    //Form master group methods
    async getAllGroup() {
        return this.repo.findAllGroup();
    }

    async createFormMasterGroup(data: CreateFormmstGroupDto) {
        const groups = await this.repo.findAllGroup();
        const maxGroupId = groups.filter((g) => {
            //console.log(g);
            return g.VGROUPORG === data.VGROUPORG;
        });
        const id =
            maxGroupId.length > 0
                ? Math.max(...maxGroupId.map((g) => parseInt(g.VGROUP))) + 1
                : 1;
        data.VGROUP = id.toString();
        const result = await this.repo.createGroup(data);
        return result;
    }

    async updateFormMasterGroup(data: UpdateFormmstGroupDto) {
        return this.repo.updateGroup(data.VGROUPNAME, {
            VGROUPORG: data.VGROUPORG,
            VGROUP: data.VGROUP,
        });
    }

    //Form master auth methods
    async getFormAuth(NFRMNO: number, VORGNO: string, CYEAR: string) {
        const users = await this.usr.search({ CSTATUS: '1' });
        const auth = await this.repo.findAuth(NFRMNO, VORGNO, CYEAR);
        return users.map((user) => {
            const userAuth = auth.filter((a) => a.VEMPNO === user.SEMPNO);
            return {
                ...user,
                auth: userAuth,
            };
        });
    }

    async upsertFormAuth(authData: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        VEMPNO: string;
        CAUTHNO: string;
    }) {
        //console.log('Upsert Form Auth:', authData); // Debugging line
        const { NFRMNO, VORGNO, CYEAR, VEMPNO } = authData;
        const existingAuth = await this.repo.findAuth(
            NFRMNO,
            VORGNO,
            CYEAR,
            VEMPNO,
        );
        //console.log(existingAuth);
        if (existingAuth.length > 0) {
            // Update existing auth
            //console.log('Update Form Auth:', authData);
            return this.repo.updateAuth(authData.CAUTHNO, {
                NFRMNO,
                VORGNO,
                CYEAR,
                VEMPNO,
            });
        } else {
            // Insert new auth
            //console.log('Create Form Auth:', authData);
            return this.repo.createAuth(authData);
        }
    }
}
