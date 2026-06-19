import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FXA_LOCMST } from 'src/common/Entities/webform/table/FXA_LOCMST.entity';
import { CreateFxaLocmstDto } from './dto/create-fxa_locmst.dto';

@Injectable()
export class FXALOCMSTRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ORGANIZATIONS`);
        // return this.getRepository(ORGANIZATIONS).find();
        return this.manager.find(FXA_LOCMST ,  {
        relations: ['ORG', 'POS'] 
        });
    }

    async findOne(locCode: string): Promise<FXA_LOCMST | null> {
        return await this.manager.findOne(FXA_LOCMST, {
            where: { LOCCODE: locCode }
        });
    }

    async insertLocation(dto: CreateFxaLocmstDto | CreateFxaLocmstDto[]): Promise<FXA_LOCMST| FXA_LOCMST[]> {
      if (Array.isArray(dto)) {
            const newLocations = this.manager.create(FXA_LOCMST, dto);
            return await this.manager.save(FXA_LOCMST, newLocations);
        } 
        
        // 2. กรณีส่งมาแค่ Object เดียว
        const newLocation = this.manager.create(FXA_LOCMST, dto);
        return await this.manager.save(FXA_LOCMST, newLocation);
    }


    async importLocation(dtos: CreateFxaLocmstDto[])
    {
       return await this.manager.transaction(async (transactionManager) => {
            await transactionManager.createQueryBuilder()
                .delete()
                .from(FXA_LOCMST)
                .execute();
            const newLocations = transactionManager.create(FXA_LOCMST, dtos);
            await transactionManager.save(FXA_LOCMST, newLocations);

            return true;
        });
    }

    async updateLocation(locCode: string, dto: Partial<CreateFxaLocmstDto>): Promise<boolean> {
        const result = await this.manager.update(
            FXA_LOCMST, 
            { LOCCODE: locCode }, // เงื่อนไขในการ Update (WHERE LOCCODE = locCode)
            dto                   // ข้อมูลใหม่ที่จะนำไปอัปเดต (SET ...)
        );

        // เช็คว่ามีแถวใน Database ถูกแก้ไขไปจริงๆ ใช่ไหม (ถ้า > 0 คือสำเร็จ ถ้าเป็น 0 คือไม่พบ LOCCODE นี้)
        return result.affected > 0;
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FXA_LOCMST, 'L');
        qb.leftJoinAndSelect('L.ORG', 'org')
          .leftJoinAndSelect('L.POS', 'pos')
          .leftJoinAndSelect('L.INC', 'orgpos')
          .leftJoinAndSelect('orgpos.EMPINFO', 'userall');
        this.applyFilters(qb, 'L', dto, [
            'LOCCODE',
            'LOCNAME',
            'org.VNAME'
        ]);
        return qb.getMany();
    }
}
