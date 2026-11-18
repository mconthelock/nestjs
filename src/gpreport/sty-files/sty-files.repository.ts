import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateStyFilesDto } from './dto/create.dto';
import { STY_FILES } from 'src/common/Entities/gpreport/table/STY_FILES.entity';
import { StyFilesSubscriber } from './sty-files.subscriber';

@Injectable()
export class StyFilesRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
        ds.subscribers.push(new StyFilesSubscriber());
    }

    create(
        data: CreateStyFilesDto | CreateStyFilesDto[],
    ): Promise<STY_FILES | STY_FILES[]> {
        if (Array.isArray(data)) {
            return this.getRepository(STY_FILES).save(data);
        }
        return this.getRepository(STY_FILES).save(data);
    }
}
