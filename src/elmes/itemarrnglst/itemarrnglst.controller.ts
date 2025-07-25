import { Controller, Param, Get } from '@nestjs/common';
import { ItemarrnglstService } from './itemarrnglst.service';

@Controller('elmes/gplitem')
export class ItemarrnglstController {
  constructor(private readonly items: ItemarrnglstService) {}

  @Get('item/:ordno/:item')
  async findOrders(@Param('ordno') ordno: string, @Param('item') item: string) {
    const data = await this.items.findOrders(ordno, item);
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
