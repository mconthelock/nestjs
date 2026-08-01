import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PUREVA_SCORE } from 'src/common/Entities/webform/table/PUREVA_SCORE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreatePurevaScoreDto } from './dto/create-pureva_score.dto';

@Injectable()
export class PurevaScoreRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getMaxId(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number){
        const result = await this.getRepository(PUREVA_SCORE)
            .createQueryBuilder('score')
            .select('MAX(score.EVAID)', 'maxId')
            .where('score.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('score.VORGNO = :vorgno', { vorgno })
            .andWhere('score.CYEAR = :cyear', { cyear })
            .andWhere('score.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('score.NRUNNO = :nrunno', { nrunno })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

    async InsertScores(scores: CreatePurevaScoreDto[]){
            if (!scores || scores.length === 0) return;
    
            // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
           const result =  await this.getRepository(PUREVA_SCORE)
                .createQueryBuilder()
                .insert()
                .into(PUREVA_SCORE)
                .values(scores)
                .execute();
           return result;
    }


    async insert(dto: CreatePurevaScoreDto) {
        return this.getRepository(PUREVA_SCORE).insert(dto);
    }

    async create(dto: CreatePurevaScoreDto) {
        return this.getRepository(PUREVA_SCORE).save(dto);
    }


}
