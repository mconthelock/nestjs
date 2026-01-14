import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormService } from 'src/webform/form/form.service';
import { EbudgetQuotationService } from 'src/ebudget/ebudget-quotation/ebudget-quotation.service';
import { EbudgetQuotationProductService } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.service';

@Injectable()
export class QuotationService {
  constructor(
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
    private formService: FormService,
    private ebudgetQuotationService: EbudgetQuotationService,
    private ebudgetQuotationProductService: EbudgetQuotationProductService,
  ) {}
  /**
   * Get total amount of a quotation form
   */
  //prettier-ignore
  async getTotal(dto: FormDto) {
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
            :o_detail,
            :o_product
            );
        END;
        `,
        {
            p_nfrmno: dto.NFRMNO,
            p_vorgno: dto.VORGNO,
            p_cyear: dto.CYEAR,
            p_cyear2: dto.CYEAR2,
            p_nrunno: dto.NRUNNO,
            o_detail: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            o_product:  { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const detailCur = result.outBinds.o_detail;
        const productCur = result.outBinds.o_product;

        const detail = await detailCur.getRows();
        const product  = await productCur.getRows();

        await detailCur.close();
        await productCur.close();

        return { detail, product };

    } finally {
        await queryRunner.release();
    }
  }

  async getData(dto: FormDto) {
    const form = await this.formService.getFormDetail(dto);
    const quotationList = await this.ebudgetQuotationService.getData(dto);
    // form.quotation = quotation;
    const quotations = [];
    for ( const q of quotationList ){
        const detail = await this.formService.getPkByFormno(q.QTA_FORM);
        const product = await this.ebudgetQuotationProductService.getData(q.ID);

        detail.data.detail = q;
        detail.data.product = product;
        quotations.push(detail.data);
    }
    form.quotation = quotations;
    return form;
  }
}
