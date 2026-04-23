import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateReturnApvListDto } from './dto/create-return-apv-list.dto';
import { UpdateReturnApvListDto } from './dto/update-return-apv-list.dto';
import { RETURN_APV_LIST } from 'src/common/Entities/escs/table/RETURN_APV_LIST.entity';

@Injectable()
export class ReturnApvListRepository extends BaseRepository {
    constructor(@InjectDataSource('escsConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    upsert(dto: CreateReturnApvListDto | UpdateReturnApvListDto) {
        return this.getRepository(RETURN_APV_LIST).save(dto);
    }

    findBySec(sec: number) {
        return this.getRepository(RETURN_APV_LIST).find({
            where: { NSECID: sec },
            relations: ['ordersDrawing', 'ordersDrawing.orders'],
        });
    }
}
