import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository {
    constructor(
        @InjectDataSource('amecConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from AMECUSERALL`);
        // return this.getRepository(AMECUSERALL).find();
        return this.manager.find(User);
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
