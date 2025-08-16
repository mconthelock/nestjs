import { Itemarrnglst } from './entities/itemarrnglst.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemarrnglstService {
  constructor(
    @InjectRepository(Itemarrnglst, 'amecConnection')
    private readonly items: Repository<Itemarrnglst>,
  ) {}

  async findOrders(ordno: string, item: string) {
    const data = await this.items.find({
      where: { ORDERNO: ordno, ITEMNO: item },
      order: { SERIALNO: 'ASC' },
    });
    const rows = [];
    let i = 0;
    let x = 0;

    for (const row of data) {
      if (row.BMCLS === 'A' && row.TOTALQTY !== null) {
        if (x > 0) i++;
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
