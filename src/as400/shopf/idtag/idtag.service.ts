import { Injectable } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';
import { searchTagDto } from './dto/search-tag.dto';

@Injectable()
export class IdtagService {
  constructor(private conn: ConectionService) {}

  async search(body: searchTagDto) {
    let condition = '';
    condition += body.SCHD ? `M.M8K01 =  ${body.SCHD}` : '';
    condition += body.SCHDP ? `M.M8K02 =  ${body.SCHDP}` : '';
    condition += body.MFGNO ? `M.M8K03 =  ${body.MFGNO}` : '';
    const result = await this.conn.runQuery(
      `SELECT * FROM RTNLIBF.M008KP M JOIN RTNLIBF.Q90010P2 Q ON M.M8K03 = Q.Q9ORD WHERE Q9ORD = :tag`,
    );
    // return result;
    return body;
  }
}
