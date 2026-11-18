import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IETS_FORM } from 'src/common/Entities/webform/table/IETS_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Brackets, DataSource, In, Raw } from 'typeorm';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { DWGNOTICEPICMST } from 'src/common/Entities/webform/table/DWGNOTICEPICMST.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';

@Injectable()
export class IetsFormRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateIetsFormDto) {
        return this.getRepository(IETS_FORM).insert(dto);
    }

    async create(dto: CreateIetsFormDto) {
        return this.getRepository(IETS_FORM).save(dto);
    }

    async update(con: FormDto, dto: UpdateIetsFormDto): Promise<boolean> {
        const result = await this.getRepository(IETS_FORM).update(con, dto);
        return (result.affected ?? 0) > 0;
    }

    async getData(dto: FormDto) {
        const query = this.getRepository(IETS_FORM)
            .createQueryBuilder('form')

            .leftJoinAndSelect('form.ORG', 'org')

            // 2. Join ตาราง FORM และ flow ที่อยู่ข้างใน
            .leftJoinAndSelect('form.FORM', 'formMaster')
            .leftJoinAndSelect('formMaster.flow', 'flow')

            // 3. Join ตาราง LISTS (IETS_LIST)
            .leftJoinAndSelect('form.LISTS', 'lists')

            // 4. 💡 Join ตาราง PICMST แบบพิเศษเพื่อใส่ฟังก์ชัน TRIM()
            .leftJoinAndMapOne(
                'lists.PICMST', // เอาไปเก็บไว้ใน property PICMST ของ lists
                DWGNOTICEPICMST, // Entity ที่ต้องการ Join
                'picmst', // นามแฝง
                'TRIM(lists.ITMNO) = TRIM(picmst.ITEMNO)', // 👈 เงื่อนไขตัดช่องว่าง
            );

        // 5. นำเงื่อนไขจาก dto มาวนลูปใส่ใน Where (แทน ...dto แบบเดิม)
        for (const key in dto) {
            if (dto[key] !== undefined && dto[key] !== null) {
                query.andWhere(`form.${key} = :${key}`, { [key]: dto[key] });
            }
        }

        // คืนค่าผลลัพธ์เป็น Object 1 รายการ เหมือนการใช้ findOne
        return await query.getOne();
    }

    // async getData(dto: FormDto) {
    //     return await this.getRepository(IETS_FORM).findOne({
    //         where: {
    //             ...dto,
    //         },
    //         relations: {
    //             ORG: true,
    //             FORM: {
    //                 flow: true, // เพิ่มบรรทัดนี้เพื่อดึง FLOW ที่อยู่ใน FORM
    //             },

    //             LISTS: {
    //                 PICMST: true,
    //             },
    //         },
    //     });
    // }

    async getPicByItemNos(itemNos: string[]) {
        return this.getRepository(DWGNOTICEPICMST).find({
            where: {
                // ใช้ Raw เพื่อเขียน SQL function ครอบ column
                ITEMNO: Raw((alias) => `TRIM(${alias}) IN (:...itemNos)`, {
                    itemNos: itemNos,
                }),
            },
            relations: ['PICINFO'],
            // where: {
            //     ITEMNO: In(itemNos),
            // },
        });
    }
}
