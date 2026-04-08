import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class AmecUserAllRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from AMECUSERALL`);
        // return this.getRepository(AMECUSERALL).find();
        return this.manager.find(AMECUSERALL);
    }

    findOne(empno: string) {
        return this.getRepository(AMECUSERALL).findOne({
            where: { SEMPNO: empno },
        });
    }

    findEmpEncode(empno: string) {
        return this.getRepository(AMECUSERALL).findOne({
            where: { SEMPENCODE: empno },
        });
    }

    findEmpBirth(month: string) {
        return this.getRepository(AMECUSERALL)
            .createQueryBuilder('user')
            .where(
                "cstatus = '1' and sposcode < 80 and birthday is not null and SUBSTR(birthday, 5, 2) = :month",
                { month },
            )
            .orderBy('birthday')
            .getMany();
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(AMECUSERALL, 'A');
        this.applyFilters(qb, 'A', dto, [
            'SEMPNO',
            'SPOSCODE',
            'SSECCODE',
            'SDEPCODE',
            'SDIVCODE',
        ]);
        return qb.getMany();
    }
}
