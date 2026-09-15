import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { MHMBNF00 } from 'src/common/Entities/gpreport/table/MHMBNF00.entity';
import { MHMEMJ00 } from 'src/common/Entities/gpreport/table/MHMEMJ00.entity';
import { MHMEMP00 } from 'src/common/Entities/gpreport/table/MHMEMP00.entity';
import { MHMPSN00 } from 'src/common/Entities/gpreport/table/MHMPSN00.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(User, 'gpreportConnection')
        private readonly User: Repository<User>,

        @InjectRepository(MHMEMJ00, 'gpreportConnection')
        private readonly jp: Repository<MHMEMJ00>,

        @InjectRepository(MHMEMP00, 'gpreportConnection')
        private readonly mp: Repository<MHMEMP00>,

        @InjectRepository(MHMPSN00, 'gpreportConnection')
        private readonly addr: Repository<MHMPSN00>,

        @InjectRepository(MHMBNF00, 'gpreportConnection')
        private readonly bf: Repository<MHMBNF00>,
    ) {}

    async findOne(id: string) {
        const isJapan = id.substring(0, 1) === 'J';
        const user = await this.User.findOneBy({ SEMPNO: id });
        const info = isJapan
            ? await this.jp.findOneBy({ EMPCOD: id })
            : await this.mp.findOneBy({ EMPCOD: id });
        const address = await this.addr.findOneBy({ EMPCOD: id });
        const benefit = await this.bf.find({ where: { EMPCOD: id } });
        return { user, info, address, benefit };
    }
}
