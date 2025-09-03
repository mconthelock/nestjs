import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Pdepartment } from '../pdepartment/entities/pdepartment.entity';
import { Pdivision } from '../pdivision/entities/pdivision.entity';
import { SearchDepartmentDto } from './dto/search-department.dto';
import { getSafeFields } from '../../utils/Fields';

@Injectable()
export class PdepartmentService {
  constructor(
    @InjectRepository(Pdepartment, 'webformConnection')
    private sectionRepo: Repository<Pdepartment>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  private department = this.dataSource
    .getMetadata(Pdepartment)
    .columns.map((c) => c.propertyName);
  private division = this.dataSource
    .getMetadata(Pdivision)
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.department, ...this.division];

  getDepartmentAll() {
    return this.sectionRepo.find({
      order: {
        SDEPCODE: 'ASC',
      },
    });
  }

  getDepartmentByCode(id: string) {
    return this.sectionRepo.findOne({
      where: { SDEPCODE: id },
      order: {
        SDEPCODE: 'ASC',
      },
    });
  }

  getDepartment(searchDto: SearchDepartmentDto) {
    const { SDEPCODE, SDIVCODE, fields = [] } = searchDto;
    const query = this.dataSource.createQueryBuilder().from('PDIVISION', 'A');

    if (SDIVCODE) query.andWhere('A.SDIVCODE = :SDIVCODE', { SDIVCODE });
    if (SDEPCODE) query.andWhere('B.SDEPCODE = :SDEPCODE', { SDEPCODE });

    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }

    select.forEach((f) => {
      if (this.department.includes(f)) {
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
    query
      .andWhere('B.SDEPARTMENT NOT LIKE :department', {
        department: '%Cancel%',
      })
      .andWhere('B.SDEPCODE != :departmentCode', { departmentCode: '00' });
    return query.getRawMany();
  }
}
