import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { searchDto } from './dto/search-user.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

@Injectable()
export class UsersRepository extends BaseRepository {
    constructor(@InjectDataSource('amecConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findAll(q?: searchDto) {
        const qb = this.getRepository(User).createQueryBuilder('user');

        if (q) {
            await applyDynamicFilters(qb, q, 'user');
        }

        return qb.getMany();
    }

    findEmpEncode(empno: string) {
        return this.getRepository(User).findOne({
            where: { SEMPENCODE: empno },
        });
    }

    findOne(empno: string) {
        return this.getRepository(User).findOne({
            where: { SEMPNO: empno },
        });
    }

    findBirthday(month: string) {
        return this.getRepository(User)
            .createQueryBuilder('user')
            .where(
                "cstatus = '1' and sposcode < 80 and birthday is not null and SUBSTR(birthday, 5, 2) = :month",
                { month },
            )
            .orderBy('birthday')
            .getMany();
    }
}
