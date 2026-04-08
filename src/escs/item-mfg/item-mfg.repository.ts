import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { CreateItemMfgDto } from './dto/create-item-mfg.dto';
import { UpdateItemMfgDto } from './dto/update-item-mfg.dto';

@Injectable()
export class ItemMfgRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateItemMfgDto) {
        return this.getRepository(ITEM_MFG).save(dto);
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ITEM_MFG`);
        // return this.getRepository(ITEM_MFG).find();
        return this.manager.find(ITEM_MFG);
    }

    findOne(id: number) {
        return this.getRepository(ITEM_MFG).findOne({
            where: { NID: id },
            relations: ['BLOCK_MASTER', 'ITEM_LIST', 'DELETE_LIST', 'CONTROL_LIST'],
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(ITEM_MFG, 'I');
        this.applyFilters(qb, 'I', dto, [
            'NID',
            'VITEM_NAME',
            'NBLOCKID',
            'NSTATUS',
            'NSEC_ID',
            'NTYPE',
            'NUSERUPDATE',
        ]);
        return qb
            .innerJoinAndSelect('I.USER_SECTION', 'US')
            .innerJoinAndSelect('I.ITEM_STATUS', 'IS')
            .innerJoinAndSelect('I.ITEM_MFG_TYPE', 'IMT')
            .innerJoinAndSelect('I.BLOCK_MASTER', 'BM')
            .orderBy('I.NID', 'ASC')
            .getMany();
    }

    async update(id: number, dto: UpdateItemMfgDto) {
        return this.getRepository(ITEM_MFG).update(
            { NID: id, NSTATUS: Not(3) },
            dto,
        );
    }

    async remove(id: number) {
        return this.getRepository(ITEM_MFG).delete(id);
    }
}
