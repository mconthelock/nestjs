import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Spaccarrnglst } from './entities/spaccarrnglst.entity';

import { SearchSpaccarrnglstDto } from './dto/search-spaccarrnglst.dto';
@Injectable()
export class SpaccarrnglstService {
  constructor(
    @InjectRepository(Spaccarrnglst, 'elmesConnection')
    private readonly items: Repository<Spaccarrnglst>,
  ) {}

  async findAll(q: SearchSpaccarrnglstDto) {
    const data = await this.items.find({
      where: { ORDERNO: q.ORDERNO, ITEMNO: q.ITEMNO },
      order: { SERIALNO: 'ASC' },
    });

    const rows = [];
    let i = 0;
    let x = 0;

    for (const row of data) {
      if (row.BMCLS === 'A') {
        if (x > 0) i++;
        rows[i] = {
          orderno: row.ORDERNO,
          carno: row.ORDERNO.substring(6, 8),
          itemno: row.ITEMNO,
          partname: row.APNAMERMRK?.trimStart() || '',
          drawing: row.PARTNO,
          variable: '',
          qty: 1,
          scndpart: row.SCNDPRTCLS,
          supply: 'AMEC',
        };
      } else if (row.BMCLS === 'C') {
        if (rows[i].variable !== '') {
          rows[i].variable += ', ' + (row.PARTNO?.trimStart() || '');
        } else {
          rows[i].variable += row.PARTNO?.trimStart() || '';
        }
      } else {
        rows[i].drawing += row.PARTNO?.trimStart() || '';
      }
      x++;
    }
    return rows;
  }
}
