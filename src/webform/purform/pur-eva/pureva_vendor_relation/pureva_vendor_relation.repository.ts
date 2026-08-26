import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PUREVA_VENDOR_RELATION } from 'src/common/Entities/webform/table/PUREVA_VENDOR_RELATION.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurevaVendorRelationDto } from './dto/create-pureva_vendor_relation.dto';

@Injectable()
export class PurevaRelationRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getMaxId(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number  ){
        const result = await this.getRepository(PUREVA_VENDOR_RELATION)
            .createQueryBuilder('relation')
            .select('MAX(relation.ID)', 'maxId')
            .where('relation.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('relation.VORGNO = :vorgno', { vorgno })
            .andWhere('relation.CYEAR = :cyear', { cyear })
            .andWhere('relation.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('relation.NRUNNO = :nrunno', { nrunno })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

    async InsertRelations(relations: CreatePurevaVendorRelationDto[]){
            if (!relations || relations.length === 0) return;
    
            // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
           const result =  await this.getRepository(PUREVA_VENDOR_RELATION)
                .createQueryBuilder()
                .insert()
                .into(PUREVA_VENDOR_RELATION)
                .values(relations)
                .execute();
           return result;
    }


    async insert(dto: CreatePurevaVendorRelationDto) {
        return this.getRepository(PUREVA_VENDOR_RELATION).insert(dto);
    }

    async create(dto: CreatePurevaVendorRelationDto) {
        return this.getRepository(PUREVA_VENDOR_RELATION).save(dto);
    }

    async deleteByAll(dto: FormDto) {
            return this.getRepository(PUREVA_VENDOR_RELATION).delete(dto);
    }


}
