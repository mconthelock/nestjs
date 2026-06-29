import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FINPCK_ASSET } from 'src/common/Entities/webform/table/FINPCK_ASSET.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto} from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreateFinpckAssetDto } from './dto/create-finpck_asset.dto';
import { UpdateFinpckAssetDto } from './dto/update-finpck_asset.dto';

@Injectable()
export class FinpckAssetRepository extends BaseRepository {
   constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

async getMaxId(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number){
        const result = await this.getRepository(FINPCK_ASSET)
            .createQueryBuilder('asset')
            .select('MAX(asset.ID)', 'maxId')
            .where('asset.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('asset.VORGNO = :vorgno', { vorgno })
            .andWhere('asset.CYEAR = :cyear', { cyear })
            .andWhere('asset.CYEAR2 = :cyear2', { cyear2 })
            .andWhere('asset.NRUNNO = :nrunno', { nrunno })
            .getRawOne();

        return result?.maxId ? Number(result.maxId) : 0;
    }

async bulkInsertAssets(assets: CreateFinpckAssetDto[]){
        if (!assets || assets.length === 0) return;

        // ใช้ this.getRepository() สำหรับ Insert ก็ได้เหมือนกันค่ะ
       const result =  await this.getRepository(FINPCK_ASSET)
            .createQueryBuilder()
            .insert()
            .into(FINPCK_ASSET)
            .values(assets)
            .execute();
       return result;
    }
    
    async upsertAssets(assets: UpdateFinpckAssetDto[]) {
        if (!assets || assets.length === 0) return;
        const conflictKeys = ['NFRMNO', 'VORGNO', 'CYEAR', 'CYEAR2', 'NRUNNO', 'ID'];
        const updateColumns = Object.keys(assets[0]).filter(
            (key) => !conflictKeys.includes(key)
        );
        if (updateColumns.length === 0) return;
        const result = await this.getRepository(FINPCK_ASSET)
            .createQueryBuilder()
            .insert()
            .into(FINPCK_ASSET)
            .values(assets)
            .orUpdate(
                updateColumns, // ใช้ตัวแปรนี้แทนการระบุ ['QTY', 'REMARK', ...] เอง
                conflictKeys   // ระบุคีย์เพื่อบอก Database ว่าจะเช็คข้อมูลซ้ำจากฟิลด์ไหน
            )
            .execute();

        return result;
    }
}