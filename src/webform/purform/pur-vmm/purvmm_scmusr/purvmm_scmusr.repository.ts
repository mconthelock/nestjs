import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURVMM_SCMUSR } from 'src/common/Entities/webform/table/PURVMM_SCMUSR.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurVmmScmusrDto } from './dto/create-purvmm_scmusr.dto';
import { UpdatePurVmmDto } from '../dto/update-pur-vmm.dto';

@Injectable()
export class PurvmmScmuserRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreatePurVmmScmusrDto) {
        return this.getRepository(PURVMM_SCMUSR).insert(dto);
    }

    async create(dto: CreatePurVmmScmusrDto) {
        return this.getRepository(PURVMM_SCMUSR).save(dto);
    }

    async update(con: FormDto, dto: UpdatePurVmmDto): Promise<boolean> {
        const result = await this.getRepository(PURVMM_SCMUSR).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async getMaxId(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const result = await this.getRepository(PURVMM_SCMUSR)
            .createQueryBuilder('usr')
            .select('MAX(usr.ID)', 'maxId')
            .where('usr.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('usr.VORGNO = :vorgno', { vorgno })
            .andWhere('usr.CYEAR = :cyear', { cyear })
            .andWhere('usr.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('usr.NRUNNO = :nrunno', { nrunno })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

    async InsertUsers(users: CreatePurVmmScmusrDto[]) {
        if (!users || users.length === 0) return;

        // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
        const result = await this.getRepository(PURVMM_SCMUSR)
            .createQueryBuilder()
            .insert()
            .into(PURVMM_SCMUSR)
            .values(users)
            .execute();
        return result;
    }

    async deleteByAll(dto: FormDto) {
        return this.getRepository(PURVMM_SCMUSR).delete(dto);
    }
}
