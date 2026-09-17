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

        const emp01 = await this.getRepository(EMP01).findOne({
            where: { EMPCOD: id },
            select: ['DESDST', 'PSNBLD', 'PTEL'],
        });
        const address = await this.findAddres(id);
        const email = await this.findEmail(id);
        const emaillog = await this.findEmailLog(id);
        const provident = await this.findProvident(id);
        const insurance = await this.findInsurance(id);
        const beneficiary = await this.findBeneficiary(id);
        const cremation = await this.findCremation(id);

        return {
            user,
            emp01,
            address,
            provident,
            insurance,
            beneficiary,
            cremation,
            email,
            emaillog,
        };
    }

    async findAddres(id: string) {
        const address = await this.getRepository(MHMPSN00).findOne({
            where: { EMPCOD: id },
        });
        return this.encrypt(
            address,
            ['PSNAD1', 'PSNAD2', 'PSNBDT', 'PSNIDN', 'PADD1', 'PADD2'],
            'include',
        );
    }

    async findEmail(id: string) {
        if (process.env.STATE != 'production')
            return {
                MEMCOD: id,
                MEMEML: 'sec_wsd@MitsubishiElevatorAsia.co.th',
            };
        return await this.getRepository(MHMEML00).findOne({
            where: { MEMCOD: id },
        });
    }

    async findEmailLog(id: string) {
        const emaillog = await this.getRepository(EmailLogs)
            .createQueryBuilder('emaillog')
            .where('LOG_EMPNO = :id', { id })
            .getMany();
        return this.encrypt(emaillog, ['LOG_MAILNEW', 'LOG_MAILEX'], 'include');
    }

    async findProvident(id: string) {
        const provident = await this.getRepository(MHMPRF00)
            .createQueryBuilder('provident')
            .where('PRFCOD = :id', { id })
            .getMany();
        return this.encrypt(
            provident,
            ['PRFBN1', 'PRFBN2', 'PRFBN3', 'PRFBN4', 'PRFBN5'],
            'include',
        );
    }

    async findInsurance(id: string) {
        const insurance = await this.getRepository(HRMIR01P)
            .createQueryBuilder('insurance')
            .where('IEMP = :id', { id })
            .getMany();
        return this.encrypt(
            insurance,
            ['IBEN1', 'IBEN2', 'IBEN3', 'IBEN4', 'IBEN5'],
            'include',
        );
    }

    async findBeneficiary(id: string) {
        const beneficiary = await this.getRepository(BENEFICIARY)
            .createQueryBuilder('beneficiary')
            .where('SEMPNO = :id', { id })
            .getMany();
        return this.encrypt(beneficiary, ['BENEFICIARY_NAME'], 'include');
    }

    async findCremation(id: string) {
        const cremation = await this.getRepository(MHMBNF00)
            .createQueryBuilder('cremation')
            .where('EMPCOD = :id', { id })
            .getMany();
        const result = this.encrypt(cremation, ['BNFNME'], 'include');
        return result;
    }

    private encrypt(
        data: unknown,
        keys: string[] = [],
        mode: 'include' | 'exclude' = 'exclude',
    ): unknown {
        if (process.env.STATE == 'production') return data;

        if (data === null || data === undefined) return data;
        if (typeof data === 'string')
            return data.trim() === ''
                ? ''
                : data.replace(/[^\s/@.]/g, 'x');
        if (typeof data === 'number' || typeof data === 'bigint') return 0;
        if (typeof data === 'boolean') return false;
        if (data instanceof Date) return 'xxx';
        if (Array.isArray(data))
            return data.map((item) => this.encrypt(item, keys, mode));

        if (typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    const isListed = keys.includes(key);
                    // mode 'exclude' (default): keys ที่ระบุ = ยกเว้นไม่เข้ารหัส (ค่าเดิม), key อื่นเข้ารหัส
                    // mode 'include': keys ที่ระบุ = ต้องเข้ารหัส, key อื่นปล่อยผ่าน (ค่าเดิม)
                    const shouldEncrypt =
                        mode === 'exclude' ? !isListed : isListed;
                    return [
                        key,
                        shouldEncrypt ? this.encrypt(value, keys, mode) : value,
                    ];
                }),
            );
        }

        return data;
    }
}
