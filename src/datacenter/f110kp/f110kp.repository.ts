import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { F110KP } from 'src/common/Entities/datacenter/table/F110KP.entity';

@Injectable()
export class F110kpRepository extends BaseRepository {
  constructor(
    @InjectDataSource('datacenterConnection') ds: DataSource,
    ) {
    super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
  }

  findAll() {
    // ใช้ได้ทั้งหมด
    // return this.manager.query(`select * from F110KP`);
    // return this.getRepository(F110KP).find();
    return this.manager.find(F110KP);
  }

  findOne(id: string) {
    return this.getRepository(F110KP).findOneBy({ F11K01: id });
  }

  async search(dto: FiltersDto) {
    const qb = this.manager.createQueryBuilder(F110KP, 'I');
    this.applyFilters(qb, 'I', dto, [
      'F11K01',
      'F11K27',
    ]);
    return qb.getMany();
  }
}
