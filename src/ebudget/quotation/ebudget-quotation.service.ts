import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';

import { FormDto } from 'src/webform/form/dto/form.dto';

// import { RQFFRM } from 'src/common/Entities/webform/tables/RQFFRM.entity';
// import { RQFLIST } from 'src/common/Entities/webform/tables/RQFLIST.entity';
// import { Form } from 'src/webform/form/entities/form.entity';

@Injectable()
export class QuotationService {
  constructor(
    // @InjectRepository(RQFFRM, 'webformConnection')
    // private readonly quoForm: Repository<RQFFRM>,
    // @InjectRepository(RQFLIST, 'webformConnection')
    // private readonly quoList: Repository<RQFLIST>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}
  /**
   * Get total amount of a quotation form
   */
  //prettier-ignore
  async getTotal(dto: FormDto) {
    // return await this.dataSource.createQueryBuilder()
    // .select('F.NFRMNO, F.VORGNO, F.CYEAR, F.CYEAR2, F.NRUNNO, SUM(NVL(B.QTY, 0) * NVL(B.PRICE, 0)) AS TOTAL, F.CST AS STATUS')
    // .from(Form, 'F')
    // .leftJoin(RQFFRM, 'A', 'A.NFRMNO = F.NFRMNO AND A.VORGNO = F.VORGNO AND A.CYEAR = F.CYEAR AND A.CYEAR2 = F.CYEAR2 AND A.NRUNNO = F.NRUNNO')
    // .leftJoin(RQFLIST, 'B', 'A.NFRMNO = B.NFRMNO AND A.VORGNO = B.VORGNO AND A.CYEAR = B.CYEAR AND A.CYEAR2 = B.CYEAR2 AND A.NRUNNO = B.NRUNNO')
    // .where('F.NFRMNO = :nfrmno AND F.VORGNO = :vorgno AND F.CYEAR = :cyear AND F.CYEAR2 = :cyear2 AND F.NRUNNO = :nrunno', {
    //   nfrmno: dto.NFRMNO,
    //   vorgno: dto.VORGNO,
    //   cyear: dto.CYEAR,
    //   cyear2: dto.CYEAR2,
    //   nrunno: dto.NRUNNO,
    // })
    // .groupBy('F.NFRMNO, F.VORGNO, F.CYEAR, F.CYEAR2, F.NRUNNO, F.CST')
    // .getRawOne();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        // ดึง raw oracle connection
        const raw = await (queryRunner as any).databaseConnection;

        const result = await raw.execute(
        `
        BEGIN
            EBG_QUOTATION(
            :p_nfrmno,
            :p_vorgno,
            :p_cyear,
            :p_cyear2,
            :p_nrunno,
            :o_summary,
            :o_detail
            );
        END;
        `,
        {
            p_nfrmno: dto.NFRMNO,
            p_vorgno: dto.VORGNO,
            p_cyear: dto.CYEAR,
            p_cyear2: dto.CYEAR2,
            p_nrunno: dto.NRUNNO,
            o_summary: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            o_detail:  { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const sumCur = result.outBinds.o_summary;
        const detCur = result.outBinds.o_detail;

        const summary = await sumCur.getRows();
        const detail  = await detCur.getRows();

        await sumCur.close();
        await detCur.close();

        return { summary, detail };

    } finally {
        await queryRunner.release();
    }
  }
}
