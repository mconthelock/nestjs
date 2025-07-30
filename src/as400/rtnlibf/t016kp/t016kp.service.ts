import { Injectable } from '@nestjs/common';
import { ConectionService } from '../../conection/conection.service';

@Injectable()
export class T016kpService {
  constructor(private conn: ConectionService) {}

  async findOne() {
    const result = await this.conn.runQuery(
      `SELECT * FROM RTNLIBF.T016KP T6 JOIN BPCSFVNEW.AVM V ON T16VND = V.VENDOR`,
    );
    return result;
  }
}
