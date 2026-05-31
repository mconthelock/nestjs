import { Injectable } from '@nestjs/common';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { FormmstRepository } from './formmst.repository';

@Injectable()
export class FormmstService {
    constructor(
        private readonly repo: FormmstRepository,
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
}
