import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Formmst } from './entities/formmst.entity';
import { SearchFormmstDto } from './dto/searchFormmst.dto';
import { getSafeFields } from '../../utils/Fields';

@Injectable()
export class FormmstService {
  constructor(
    @InjectRepository(Formmst, 'amecConnection')
    private formmstRepo: Repository<Formmst>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  private formmst = this.dataSource
    .getMetadata(Formmst)
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.formmst];

  getFormMasterAll() {
    return this.formmstRepo.find();
  }

  getFormMasterByVaname(vaname: string) {
    return this.formmstRepo.findOne({
      where: { VANAME: vaname },
    });
  }

  getFormmst(searchDto: SearchFormmstDto) {
    const { NNO, VORGNO, CYEAR, VANAME, fields = [] } = searchDto;
    const query = this.formmstRepo.createQueryBuilder('A');

    if (NNO) query.andWhere('A.NNO = :NNO', { NNO });
    if (VORGNO) query.andWhere('A.VORGNO = :VORGNO', { VORGNO });
    if (CYEAR) query.andWhere('A.CYEAR = :CYEAR', { CYEAR });
    if (VANAME) query.andWhere('A.VANAME = :VANAME', { VANAME });

    let select = [];
    if (fields.length > 0) {
      select = getSafeFields(fields, this.allowFields);
    } else {
      select = this.allowFields;
    }
    query.select([]); // ล้าง select เดิมก่อน
    select.forEach((f) => {
      query.addSelect(`A.${f}`, f);
    });
    return query.getRawMany();
  }
}
