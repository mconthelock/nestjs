import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Pdivision } from '../pdivision/entities/pdivision.entity';
import { SearchDivisionDto } from './dto/search-division.dto';
import { getSafeFields } from '../../utils/Fields';

@Injectable()
export class PdivisionService {
  constructor(
    @InjectRepository(Pdivision, 'webformConnection')
    private divisionRepo: Repository<Pdivision>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  private division = this.dataSource
    .getMetadata(Pdivision)
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.division];

  getDivisionAll() {
    return this.divisionRepo.find({
      order: {
        SDIVCODE: 'ASC',
      },
    });
  }

  getDivisionByCode(id: string) {
    return this.divisionRepo.findOne({
      where: { SDIVCODE: id },
      order: {
        SDIVCODE: 'ASC',
      },
    });
  }

  getDivision(searchDto: SearchDivisionDto) {
    const { SDIVCODE, fields = [] } = searchDto;
    const query = this.dataSource.createQueryBuilder().from('PDIVISION', 'A');

    if (SDIVCODE) query.andWhere('A.SDIVCODE = :SDIVCODE', { SDIVCODE });

    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }

    select.forEach((f) => {
      query.addSelect(`A.${f}`, f);
    });
    query.andWhere('A.SDIVISION NOT LIKE :division', { division: '%Cancel%' });
    return query.getRawMany();
  }
}
