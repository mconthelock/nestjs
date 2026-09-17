import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';
import { MHMEMP00 } from 'src/common/Entities/gpreport/views/MHMEMP00.entity';
import { MHMEMJ00 } from 'src/common/Entities/gpreport/views/MHMEMJ00.entity';
import { MHMPSN00 } from 'src/common/Entities/gpreport/views/MHMPSN00.entity';
import { EMP01 } from 'src/common/Entities/gpreport/views/EMP01.entity';
import { MHMBNF00 } from 'src/common/Entities/gpreport/views/MHMBNF00.entity';
import { HRMIR01P } from 'src/common/Entities/gpreport/views/HRMIR01P.entity';
import { MHMPRF00 } from 'src/common/Entities/gpreport/views/MHMPRF00.entity';
import { BENEFICIARY } from 'src/common/Entities/gpreport/table/BENEFICIARY.entity';
import { MHMEML00 } from 'src/common/Entities/gpreport/views/MHMEML00.entity';
import { EmailLogs } from 'src/common/Entities/gpreport/table/EMPLOYEE_MAIL_LOG.entity';

@Injectable()
export class EmployeeRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds);
    }

    async findOne(id: string) {
        const user = await this.getRepository(User).findOne({
            where: { SEMPNO: id },
        });

        const isJapan = id.substring(0, 1) === 'J';
        const info = isJapan
            ? await this.getRepository(MHMEMJ00).findOne({
                  where: { EMPCOD: id },
              })
            : await this.getRepository(MHMEMP00).findOne({
                  where: { EMPCOD: id },
              });

        const address = await this.getRepository(MHMPSN00).findOne({
            where: { EMPCOD: id },
        });

        const emp01 = await this.getRepository(EMP01).findOne({
            where: { EMPCOD: id },
        });

        const email = await this.getRepository(MHMEML00).findOne({
            where: { MEMCOD: id },
        });

        const emaillog = await this.getRepository(EmailLogs)
            .createQueryBuilder('emaillog')
            .where('LOG_EMPNO = :id', { id })
            .getMany();

        const provident = await this.getRepository(MHMPRF00)
            .createQueryBuilder('provident')
            .where('PRFCOD = :id', { id })
            .getMany();

        const insurance = await this.getRepository(HRMIR01P)
            .createQueryBuilder('insurance')
            .where('IEMP = :id', { id })
            .getMany();

        const beneficiary = await this.getRepository(BENEFICIARY)
            .createQueryBuilder('beneficiary')
            .where('SEMPNO = :id', { id })
            .getMany();

        const cremation = await this.getRepository(MHMBNF00)
            .createQueryBuilder('cremation')
            .where('EMPCOD = :id', { id })
            .getMany();

        return {
            user,
            info,
            address,
            emp01,
            provident,
            insurance,
            beneficiary,
            cremation,
            email,
            emaillog,
        };
    }
}
