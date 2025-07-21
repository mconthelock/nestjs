import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Formmst } from './entities/formmst.entity';
import { Formmstts } from './entities/formmstts.entity';
import { SearchDto } from './dto/search.dto';
import { getSafeFields } from '../../utils/Fields';
import { setRepo } from '../../utils/repo';

@Injectable()
export class FormmstService {
  constructor(
    @InjectRepository(Formmst, 'amecConnection')
    private formmstRepo: Repository<Formmst>,
    @InjectRepository(Formmstts, 'amecConnection')
    private formmsttsRepo: Repository<Formmstts>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  private formmst = this.dataSource
    .getMetadata(Formmst)
    .columns.map((c) => c.propertyName);
  private allowFields = [...this.formmst];

  getFormMasterAll(host: string) {
    const repo = setRepo(this.formmstRepo, this.formmsttsRepo, host);
    return repo.find();
  }

  getFormMasterByVaname(vaname: string, host: string) {
    const repo = setRepo(this.formmstRepo, this.formmsttsRepo, host);
    return repo.findOne({
      where: { VANAME: vaname },
    });
  }

  getFormmst(searchDto: SearchDto, host: string) {
    const repo = setRepo(this.formmstRepo, this.formmsttsRepo, host);
    const { NNO, VORGNO, CYEAR, VANAME, fields = [] } = searchDto;
    const query = repo.createQueryBuilder('A');

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
