import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { MATERIAL_STATUS_INQUIRY_VIEW } from 'src/common/Entities/workload/views/MATERIAL_STATUS_INQUIRY_VIEW.entity';
import { IfindByDataTableServerside } from './material_status_inquiry_view.interface';

@Injectable()
export class MaterialStatusInquiryViewRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findByDataTableServerside(params: IfindByDataTableServerside) {
        try {
            const { start, length, order, condition } = params;
            const query = this.getRepository(
                MATERIAL_STATUS_INQUIRY_VIEW,
            ).createQueryBuilder('M');

            if (length >= 0) {
                query.skip(start).take(length);
            }

            const total = await this.getRepository(
                MATERIAL_STATUS_INQUIRY_VIEW,
            ).count();

            // if(order && order.length > 0) {
            //     order.forEach((o) => {
            //         const columnName = o.name;
            //         const direction = o.dir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            //         query.addOrderBy(`M.${columnName}`, direction);
            //     });
            // }
            const [data, count] = await query.getManyAndCount();
            return {
                recordsTotal: total,
                recordsFiltered: count,
                data: data,
            };
        } catch (error) {
            throw error;
        }
    }
}
