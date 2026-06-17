import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateMfgOrDto } from './dto/create-mfg-or.dto';
import { GetMfgOrDto } from './dto/get-mfg-or.dto';

@Injectable()
export class MfgOrService {
  constructor(
    @InjectDataSource('webformConnection')
    private readonly dataSource: DataSource,
  ) {}

  private getKey(dto: GetMfgOrDto) {
    return {
      NFRMNO: Number(dto.NFRMNO),
      VORGNO: dto.VORGNO,
      CYEAR: dto.CYEAR,
      CYEAR2: dto.CYEAR2,
      NRUNNO: Number(dto.NRUNNO),
    };
  }

  private getTodayText() {
    const today = new Date();
    return (String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear());
  }

    private async getMfgOrFormByKey(manager: any, dto: GetMfgOrDto) {
      const key = this.getKey(dto);

      return manager
        .createQueryBuilder()
        .select('A.*')
        .from('MFGOR_FORM', 'A')
        .where('A.NFRMNO = :NFRMNO', key)
        .andWhere('A.VORGNO = :VORGNO', key)
        .andWhere('A.CYEAR = :CYEAR', key)
        .andWhere('A.CYEAR2 = :CYEAR2', key)
        .andWhere('A.NRUNNO = :NRUNNO', key)
        .getRawOne();
    }

  async createorform(dto: CreateMfgOrDto) {
    return this.dataSource.transaction(async manager => {
      await manager
        .createQueryBuilder()
        .insert()
        .into('MFGOR_FORM')
        .values({
          NFRMNO: dto.NFRMNO,
          VORGNO: dto.VORGNO,
          CYEAR: dto.CYEAR,
          CYEAR2: dto.CYEAR2,
          NRUNNO: dto.NRUNNO,

          TYPEFORM: dto.TYPEFORM,
          CLASS: dto.CLASS,
          TOPIC: dto.TOPIC,
          DWGNO: dto.DWGNO,
          SHOPNO: dto.SHOPNO,
          ITEMNO: dto.ITEMNO,
          APPLY_FOR: dto.APPLY_FOR,
          SEQNO: dto.SEQNO,
          ORNO: dto.ORNO,
          REV: dto.REV,
        })
        .execute();

      if (dto.att?.length) {
        const attRows = dto.att.map((file, index) => ({
          NFRMNO: dto.NFRMNO,
          VORGNO: dto.VORGNO,
          CYEAR: dto.CYEAR,
          CYEAR2: dto.CYEAR2,
          NRUNNO: dto.NRUNNO,
          ID: index + 1,
          FILENAME: file.FILENAME,
        }));

        await manager
          .createQueryBuilder()
          .insert()
          .into('MFGOR_ATT')
          .values(attRows)
          .execute();
      }

      return {
        status: true,
        message: 'Create MFG OR success',
      };
    });
  }

  async getMfgOr(dto: GetMfgOrDto) {
    const key = this.getKey(dto);
    const form = await this.dataSource
      .createQueryBuilder()
      .select([
        'A.*',
        'B.SEMPNO AS REQ_EMPNO',
        'B.SNAME AS REQ_NAME',
        'B.SSEC AS REQ_SEC',
        'C.SEMPNO AS INP_EMPNO',
        'C.SNAME AS INP_NAME',
      ])
      .from('FORM', 'A')
      .leftJoin('AMECUSERALL', 'B', 'A.VREQNO = B.SEMPNO')
      .leftJoin('AMECUSERALL', 'C', 'A.VINPUTER = C.SEMPNO')
      .where('A.NFRMNO = :NFRMNO', key)
      .andWhere('A.VORGNO = :VORGNO', key)
      .andWhere('A.CYEAR = :CYEAR', key)
      .andWhere('A.CYEAR2 = :CYEAR2', key)
      .andWhere('A.NRUNNO = :NRUNNO', key)
      .getRawOne();

    const flow = await this.dataSource
      .createQueryBuilder()
      .select('F.*')
      .from('FLOW', 'F')
      .where('F.NFRMNO = :NFRMNO', key)
      .andWhere('F.VORGNO = :VORGNO', key)
      .andWhere('F.CYEAR = :CYEAR', key)
      .andWhere('F.CYEAR2 = :CYEAR2', key)
      .andWhere('F.NRUNNO = :NRUNNO', key)
      .orderBy('F.CSTEPNO', 'ASC')
      .getRawMany();

    const head = await this.dataSource
      .createQueryBuilder()
      .select('H.*')
      .from('MFGOR_FORM', 'H')
      .where('H.NFRMNO = :NFRMNO', key)
      .andWhere('H.VORGNO = :VORGNO', key)
      .andWhere('H.CYEAR = :CYEAR', key)
      .andWhere('H.CYEAR2 = :CYEAR2', key)
      .andWhere('H.NRUNNO = :NRUNNO', key)
      .getRawOne();

    const att = await this.dataSource
      .createQueryBuilder()
      .select('A.*')
      .from('MFGOR_ATT', 'A')
      .where('A.NFRMNO = :NFRMNO', key)
      .andWhere('A.VORGNO = :VORGNO', key)
      .andWhere('A.CYEAR = :CYEAR', key)
      .andWhere('A.CYEAR2 = :CYEAR2', key)
      .andWhere('A.NRUNNO = :NRUNNO', key)
      .orderBy('A.ID', 'ASC')
      .getRawMany();

    return {
      status: true,
      data: {
        form,
        flow,
        head,
        att,
      },
    };
  }

  async generateNewOrNo(dto: GetMfgOrDto & { FORMNO?: string }) {
    return this.dataSource.transaction(async manager => {
      const form = await this.getMfgOrFormByKey(manager, dto);

      if (!form) {
        throw new Error('MFGOR_FORM not found');
      }

      const key = this.getKey(dto);
      const year2 = String(new Date().getFullYear()).slice(-2);

      const result = await manager
        .createQueryBuilder()
        .select('MAX(A.SEQNO)', 'MAXSEQNO')
        .from('MFGOR_FORM', 'A')
        .where('A.CYEAR2 = :cyear2', { cyear2: dto.CYEAR2 })
        .getRawOne();

      const maxSeqNo = Number(result?.MAXSEQNO || 0);
      const nextSeqNo = maxSeqNo + 1;
      const seqText = String(nextSeqNo).padStart(3, '0');
      const orno = `OR-MFG-${year2}${seqText}`;

      await manager
        .createQueryBuilder()
        .update('MFGOR_FORM')
        .set({
          SEQNO: nextSeqNo,
          ORNO: orno,
        })
        .where('NFRMNO = :NFRMNO', key)
        .andWhere('VORGNO = :VORGNO', key)
        .andWhere('CYEAR = :CYEAR', key)
        .andWhere('CYEAR2 = :CYEAR2', key)
        .andWhere('NRUNNO = :NRUNNO', key)
        .execute();

      await manager
        .createQueryBuilder()
        .insert()
        .into('MFGOR_CENTER')
        .values({
          ORNO: orno,
          CYEAR: String(dto.CYEAR2).slice(-2),
          SEQ: nextSeqNo,
          TOPIC: form.TOPIC,
          REVNO: form.REV,
          ISSUE_DATE: () => 'SYSDATE',
          FORMNO: dto.FORMNO || null,
        })
        .execute();

      return {
        status: true,
        TYPEFORM: 'NEW',
        SEQNO: nextSeqNo,
        ORNO: orno,
      };
    });
  }

  async updateMfgOrCenterForRevise(dto: GetMfgOrDto & { FORMNO?: string }) {
    return this.dataSource.transaction(async manager => {
      const form = await this.getMfgOrFormByKey(manager, dto);
      const orno = form.ORNO;

      if (!orno) {
        throw new Error('ORNO not found for revise');
      }

      await manager
        .createQueryBuilder()
        .update('MFGOR_CENTER')
        .set({
          TOPIC: form.TOPIC,
          REVISE_DATE: () => 'SYSDATE',
          REVNO: form.REV,
          FORMNO: dto.FORMNO || null,
        })
        .where('ORNO = :ORNO', { ORNO: orno })
        .execute();

      return {
        status: true,
        TYPEFORM: 'REVISE',
        ORNO: orno,
      };
    });
  }


}