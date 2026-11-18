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
    constructor(@InjectDataSource('mitsuConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateIetsListDto) {
        return this.getRepository(IETS_LIST).insert(dto);
    }

    async create(dto: CreateIetsListDto) {
        return this.getRepository(IETS_LIST).save(dto);
    }

    async getMaxId(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number) {
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

    // ใน IetsListRepository
    async getLatestRequestsByDwgNos(dwgNos: string[], requestDate: string | Date) {
        if (!dwgNos || dwgNos.length === 0) return [];

        const parsedRequestDate =
            typeof requestDate === 'string' ? new Date(requestDate) : requestDate;

        const query = await this.getRepository(IETS_LIST)
            .createQueryBuilder('list')
            .innerJoin('list.IETSFRM', 'ietsForm')
            .innerJoin('ietsForm.FORM', 'form')
            .innerJoin('form.flow', 'flow')
            .select([
                'list.DWGNO AS dwgNo',
                // 1. เปลี่ยนจาก MAX(form.DREQDATE) เป็น MAX(flow.DAPVDATE)
                'MAX(flow.DAPVDATE) AS maxApvDate',
            ])
            .where('list.DWGNO IN (:...dwgNos)', {
                dwgNos: dwgNos.map((d) => d.trim()),
            })
            // 2. เพิ่มเงื่อนไข CSTEPNO = '04'
            .andWhere('flow.CSTEPNO = :stepNo', { stepNo: '04' })
            // 3. เปลี่ยนเงื่อนไขเปรียบเทียบวันที่มาใช้ flow.DAPVDATE แทน
            .andWhere('flow.DAPVDATE <= :requestDate', {
                requestDate: parsedRequestDate,
            })
            .andWhere('form.CST IN (:...cstatus)', { cstatus: ['1', '2'] })
            .groupBy('list.DWGNO');

        console.log('=== SQL History ===');
        console.log(query.getSql());
        console.log('=== Params History ===');
        console.log(query.getParameters());

        const result = await query.getRawMany();
        console.log('=== Result History ===');
        console.log(result);

        return result;
    }

    async update(con: FormDto, dto: UpdateIetsListDto): Promise<boolean> {
        const { ID, ...updateData } = dto;
        const conditions = {
            ...con,
            ID: ID,
        };
        const result = await this.getRepository(IETS_LIST).update(conditions, updateData);
        return (result.affected ?? 0) > 0;
    }

    async deleteIets(dto: FormDto) {
        return this.getRepository(IETS_LIST).delete(dto);
    }
}
