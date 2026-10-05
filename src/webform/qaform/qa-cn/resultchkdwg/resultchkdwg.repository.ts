import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource } from 'typeorm';
import { CreateResultchkdwgDto } from './dto/create-resultchkdwg.dto';
import { UpdateResultchkdwgDto } from './dto/update-resultchkdwg.dto';
import { RESULTCHKDWG } from 'src/common/Entities/webform/table/RESULTCHKDWG.entity';

@Injectable()
export class ResultChkDwgRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insertMultiple(dtos: CreateResultchkdwgDto[]) {
        return this.getRepository(RESULTCHKDWG).insert(dtos);
    }

    async create(dto: CreateResultchkdwgDto) {
        return this.getRepository(RESULTCHKDWG).save(dto);
    }

    async findByCondition(con: FormDto) {
        return this.getRepository(RESULTCHKDWG).find({
            where: {
                ...con,
            },
        });
    }

    async updateMultiple(
        con: FormDto,
        dtos: UpdateResultchkdwgDto[],
    ): Promise<boolean> {
        try {
            const updatePromises = dtos.map((dto) => {
                const condition = {
                    ...con,
                    DWGNO: dto.DWGNO, // ดึง dwg ของใครของมันมาเป็นเงื่อนไข
                };

                return this.getRepository(RESULTCHKDWG).update(condition, dto);
            });
            const results = await Promise.all(updatePromises);
            const isAnyUpdated = results.some((res) => (res.affected ?? 0) > 0);
            return isAnyUpdated;
        } catch (error) {
            throw new Error('Update multiple failed: ' + error.message);
        }
    }

    async deleteByAll(dto: FormDto) {
        return this.getRepository(RESULTCHKDWG).delete(dto);
    }
}
