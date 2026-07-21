import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PUREVA_PROFIT_TURNOVER } from 'src/common/Entities/webform/table/PUREVA_PROFIT_TURNOVER.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurevaProfitTurnoverDto } from './dto/create-pureva_profit_turnover.dto';
import { UpdatePurevaProfitTurnoverDto } from './dto/update-pureva_profit_turnover.dto';


@Injectable()
export class PurevaProfitTurnoverRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getMaxId(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number,reqtype:string){
        const result = await this.getRepository(PUREVA_PROFIT_TURNOVER)
            .createQueryBuilder('profit')
            .select('MAX(profit.ID)', 'maxId')
            .where('profit.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('profit.VORGNO = :vorgno', { vorgno })
            .andWhere('asprofitset.CYEAR = :cyear', { cyear })
            .andWhere('profit.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('profit.NRUNNO = :nrunno', { nrunno })
            .andWhere('profit.RECORD_TYPE = :reqtype', { reqtype })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

    async InsertProfits(profits: CreatePurevaProfitTurnoverDto[]){
        if (!profits || profits.length === 0) return;

        // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
       const result =  await this.getRepository(PUREVA_PROFIT_TURNOVER)
            .createQueryBuilder()
            .insert()
            .into(PUREVA_PROFIT_TURNOVER)
            .values(profits)
            .execute();
       return result;
    }

    async insert(dto: CreatePurevaProfitTurnoverDto) {
        return this.getRepository(PUREVA_PROFIT_TURNOVER).insert(dto);
    }

    async create(dto: CreatePurevaProfitTurnoverDto) {
        return this.getRepository(PUREVA_PROFIT_TURNOVER).save(dto);
    }


}
