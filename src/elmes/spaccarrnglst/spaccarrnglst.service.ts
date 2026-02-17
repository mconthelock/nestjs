import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Spaccarrnglst } from './entities/spaccarrnglst.entity';
import { SearchSpaccarrnglstDto } from './dto/search-spaccarrnglst.dto';
import { ItemarrnglstService } from '../itemarrnglst/itemarrnglst.service';
@Injectable()
export class SpaccarrnglstService {
  constructor(
    @InjectRepository(Spaccarrnglst, 'elmesConnection')
    private readonly second: Repository<Spaccarrnglst>,
    private readonly item: ItemarrnglstService,
  ) {}

  async findAll(q: SearchSpaccarrnglstDto) {
    let itemData = await this.item.findOrders(q.ORDERNO, q.ITEMNO);
    itemData = itemData.filter(
      (item) => item.scndpart !== null && item.scndpart !== 'X',
    );

    console.log(itemData);

    const data = await this.second.find({
      where: { ORDERNO: q.ORDERNO, ITEMNO: q.ITEMNO },
      order: { SERIALNO: 'ASC' },
    });

    const rows = [];
    let i = 0;
    let x = 0;
    for (const row of data) {
      if (rows[i] === undefined && row.BMCLS !== 'A') continue;
      if (row.BMCLS === 'A' && row.SCNDPRTCLS !== null) {
        if (x > 0) {
          rows[i].variable = rows[i].variable.replaceAll(',,', ',');
          i++;
        }
        rows[i] = {
          orderno: row.ORDERNO,
          carno: row.ORDERNO.substring(6, 8),
          itemno: row.ITEMNO,
          partname: row.APNAMERMRK?.trimStart() || '',
          drawing: row.PARTNO,
          variable: '',
          qty: row.TOTALQTY,
          scndpart: row.SCNDPRTCLS,
          supply: row.SUPPLYCLS,
        };
      } else if (row.BMCLS === 'B') {
        if (rows[i].variable !== '') {
          rows[i].variable += ',' + (row.PARTNO?.trimStart() || '');
        } else {
          rows[i].variable += row.PARTNO?.trimStart() || '';
        }
      } else if (row.BMCLS === 'C') {
        rows[i].drawing += row.PARTNO?.trimStart() || '';
      }
      x++;
    }

    const result = [];
    result.push(...itemData);
    result.push(...rows);
    return result;
  }
}
