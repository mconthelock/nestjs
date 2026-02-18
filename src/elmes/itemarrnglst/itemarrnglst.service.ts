import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Itemarrnglst } from './entities/itemarrnglst.entity';

@Injectable()
export class ItemarrnglstService {
  constructor(
    @InjectRepository(Itemarrnglst, 'elmesConnection')
    private readonly items: Repository<Itemarrnglst>,
    @InjectDataSource('elmesConnection')
    private ds: DataSource,
  ) {}

  async findOrders(ordno: string, item: string) {
    const data = await this.items.find({
      where: { ORDERNO: ordno, ITEMNO: item },
      order: { SERIALNO: 'ASC' },
    });
    let rows = [];
    let i = 0;
    let x = 0;
    for (const row of data) {
      if (rows[i] === undefined && row.BMCLS !== 'A') continue;
      if (row.BMCLS === 'A' && row.TOTALQTY !== null) {
        if (x > 0) {
          rows[i].variable = rows[i].variable.replaceAll(',,', ',');
          i++;
        }
        rows[i] = {
          seq: row.SERIALNO,
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
      } else {
        rows[i].drawing += row.PARTNO?.trimStart() || '';
      }
      x++;
    }
    rows.map((item) => {
      if (item.variable !== '') {
        item.variable = item.variable.replaceAll(',', ', ');
      }
    });
    return rows;
  }

  async search(ordno: string) {
    const query = `
            SELECT * FROM M12023_ITEMARRNGLST_APP A WHERE A.ORDERNO = :1
            UNION
            SELECT * FROM M12033_ITEMARRNGLST_ADJ B WHERE B.ORDERNO = :2
        `;
    const result = await this.ds.query(query, [ordno, ordno]);
    return result;
  }
}
