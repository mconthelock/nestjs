import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { getSafeFields } from 'src/common/utils/Fields.utils';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';

@Injectable()
export class FormmstRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    private formmst = this.manager.connection
        .getMetadata(FORMMST)
        .columns.map((c) => c.propertyName);
    private allowFields = [...this.formmst];

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from FORMMST`);
        // return this.getRepository(FORMMST).find();
        return this.manager.find(FORMMST);
    }

    findOne(dto: SearchFormmstDto) {
        return this.getRepository(FORMMST).findOne({
            where: dto,
        });
    }

    findByVaname(vaname: string) {
        return this.getRepository(FORMMST).findOneBy({
            VANAME: vaname,
        });
    }

    findByVanameAll(vaname: string) {
        return this.getRepository(FORMMST).findBy({
            VANAME: vaname,
        });
    }

    getFormmstById(NNO: number, VORGNO: string, CYEAR: string) {
        return this.getRepository(FORMMST).findOne({
            where: { NNO, VORGNO, CYEAR },
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FORMMST, 'F');
        this.applyFilters(qb, 'F', dto, ['NNO', 'VORGNO', 'CYEAR', 'VANAME']);
        return qb.getMany();
    }

    async getFormmst(searchDto: SearchFormmstDto) {
        const { NNO, VORGNO, CYEAR, VANAME, fields = [] } = searchDto;
        const query = this.manager.createQueryBuilder(FORMMST, 'A');

        if (NNO) query.andWhere('A.NNO = :NNO', { NNO });
        if (VORGNO) query.andWhere('A.VORGNO = :VORGNO', { VORGNO });
        if (CYEAR) query.andWhere('A.CYEAR = :CYEAR', { CYEAR });
        if (VANAME) query.andWhere('A.VANAME = :VANAME', { VANAME });

        let select = [];
        if (fields.length > 0) {
            select = getSafeFields(fields, this.allowFields);
        } else {
            select = this.allowFields;
        }
        query.select([]); // ล้าง select เดิมก่อน
        select.forEach((f) => {
            query.addSelect(`A.${f}`, f);
        });
        return query.getRawMany();
    }
}
