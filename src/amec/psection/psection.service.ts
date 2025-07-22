import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Psection } from '../psection/entities/psection.entity';
import { Pdepartment } from '../pdepartment/entities/pdepartment.entity';
import { Pdivision } from '../pdivision/entities/pdivision.entity';
import { SearchSectionDto } from './dto/search-section.dto';
import { getSafeFields } from '../../utils/Fields';

@Injectable()
export class PsectionService {
  constructor(
    @InjectRepository(Psection, 'amecConnection')
    private sectionRepo: Repository<Psection>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  private section = this.dataSource
    .getMetadata(Psection)
    .columns.map((c) => c.propertyName);
  private department = this.dataSource
    .getMetadata(Pdepartment)
    .columns.map((c) => c.propertyName);
  private division = this.dataSource
    .getMetadata(Pdivision)
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.section, ...this.department, ...this.division];

  getSectionAll() {
    return this.sectionRepo.find({
      order: {
        SSECCODE: 'ASC',
      },
    });
  }

  getSectionByCode(id: string) {
    return this.sectionRepo.findOne({
      where: { SSECCODE: id },
      order: {
        SSECCODE: 'ASC',
      },
    });
  }

  getSection(searchDto: SearchSectionDto) {
    const { SSECCODE, SDEPCODE, SDIVCODE, fields = [] } = searchDto;
    const query = this.dataSource.createQueryBuilder().from('PDIVISION', 'A');

    if (SDIVCODE) query.andWhere('A.SDIVCODE = :SDIVCODE', { SDIVCODE });
    if (SDEPCODE) query.andWhere('B.SDEPCODE = :SDEPCODE', { SDEPCODE });
    if (SSECCODE) query.andWhere('C.SSECCODE = :SSECCODE', { SSECCODE });

    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }

    select.forEach((f) => {
      if (this.section.includes(f)) {
        query.addSelect(`C.${f}`, f);
      } else if (this.department.includes(f)) {
        query.addSelect(`B.${f}`, f);
      } else {
        query.addSelect(`A.${f}`, f);
      }
    });
    query.leftJoin(
      'PDEPARTMENT',
      'B',
      'SUBSTR(SDIVCODE, 0, 2) = SUBSTR(SDEPCODE, 0, 2)',
    );
    query.leftJoin(
      'PSECTION',
      'C',
      'SUBSTR(SDEPCODE, 0, 4) = SUBSTR(SSECCODE, 0, 4)',
    );
    query
      .andWhere('C.SSECTION NOT LIKE :section', { section: '%Cancel%' })
      .andWhere('C.SSECCODE != :sectionCode', { sectionCode: '00' });
    return query.getRawMany();
  }
}
