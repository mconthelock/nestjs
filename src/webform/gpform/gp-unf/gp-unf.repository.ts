import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { UNIFORM_VIEW } from 'src/common/Entities/gpreport/views/UNIFORM_VIEW.entity';
import { UNIFORM_CATEGORY } from 'src/common/Entities/gpreport/table/UNIFORM_CATEGORY.entity';
import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';

@Injectable()
export class GpUnfRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    getUniformView(options?: any) {
        console.log(options);
        return this.getRepository(UNIFORM_VIEW).find({ where: options });
    }

    getCategory() {
        return this.getRepository(UNIFORM_CATEGORY).find({
            where: { CATOWNER: '1' },
            order: { CATID: 'ASC' },
        });
    }

    getSize(options?: any) {
        return this.getRepository(UNIFORM).find({ where: options });
    }
}
