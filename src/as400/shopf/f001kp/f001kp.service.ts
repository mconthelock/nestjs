import { Injectable } from '@nestjs/common';
import { ConectionService } from '../../conection/conection.service';
@Injectable()
export class F001kpService {
  constructor(private conn: ConectionService) {}

  async findOne() {
    const result = await this.conn.runQuery(
      `SELECT * FROM RTNLIBF.Q90010P2 Q9 JOIN SHOPF.F003KP F3 ON Q9ORD = F3.F03R02 WHERE Q9PP = 20250710`,
    );
    return result;
    // FETCH FIRST 10 ROWS ONLY
  }
}
