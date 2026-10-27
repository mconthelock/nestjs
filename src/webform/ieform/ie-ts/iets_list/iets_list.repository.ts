import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IETS_LIST } from 'src/common/Entities/webform/table/IETS_LIST.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateIetsListDto } from './dto/create-iets_list.dto';
import { UpdateIetsListDto } from './dto/update-iets_list.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class IetsListRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateIetsListDto) {
        return this.getRepository(IETS_LIST).insert(dto);
    }

    async create(dto: CreateIetsListDto) {
        return this.getRepository(IETS_LIST).save(dto);
    }

    async getMaxId(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const result = await this.getRepository(IETS_LIST)
            .createQueryBuilder('list')
            .select('MAX(list.ID)', 'maxId')
            .where('list.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('list.VORGNO = :vorgno', { vorgno })
            .andWhere('list.CYEAR = :cyear', { cyear })
            .andWhere('list.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('list.NRUNNO = :nrunno', { nrunno })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

    async InsertIets(lists: CreateIetsListDto[]) {
        if (!lists || lists.length === 0) return;

        // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
        const result = await this.getRepository(IETS_LIST)
            .createQueryBuilder()
            .insert()
            .into(IETS_LIST)
            .values(lists)
            .execute();
        return result;
    }

    async update(con: FormDto, dto: UpdateIetsListDto): Promise<boolean> {
        const result = await this.getRepository(IETS_LIST).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async deleteIets(dto: FormDto) {
        return this.getRepository(IETS_LIST).delete(dto);
    }
}
