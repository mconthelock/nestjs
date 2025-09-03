import { Injectable } from '@nestjs/common';
import { CreateAvmDto } from './dto/create-avm.dto';
import { UpdateAvmDto } from './dto/update-avm.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Avm } from './entities/avm.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { SearchAvmDto } from './dto/search-avm.dto';
import { getSafeFields } from 'src/common/utils/Fields.utils';
@Injectable()
export class AvmService {
  constructor(
    @InjectRepository(Avm, 'amecConnection')
    private avmRepository: Repository<Avm>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  private readonly avmFields = this.dataSource
    .getMetadata(Avm)
    .columns.map((c) => c.propertyName);

  async search(dto: SearchAvmDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const {
      fields = [],
      distinct = false,
      orderby = null,
      orderbyDirection = 'ASC',
      ...condition
    } = dto;
    const query = repo.createQueryBuilder().from('AVM', 'A');

    query.distinct(distinct == true); // เพื่อไม่ให้มีข้อมูลซ้ำ
    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.avmFields);
    } else {
      select = this.avmFields;
    }
    
    select.forEach((f) => {
        console.log(f);
        
      query.addSelect(`A.${f}`, f);
    });

    for (const [key, value] of Object.entries(condition)) {
      if (value !== undefined) {
        query.andWhere(`A.${key} = :${key}`, { [key]: value });
      }
    }

    if (orderby) query.orderBy(orderby, orderbyDirection);

    return query.getRawMany();
  }
}
