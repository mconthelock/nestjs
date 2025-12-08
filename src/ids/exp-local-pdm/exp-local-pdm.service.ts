import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SearchExpLocalPdmDto } from './dto/search-exp-local-pdm.dto';

@Injectable()
export class ExpLocalPdmService {
  constructor(
    @InjectDataSource('pdmConnection')
    private readonly dataSource: DataSource,
  ) {}

  private baseQuery = this.dataSource
    .createQueryBuilder()
    .select(
      `d.drawing_no,
    d.revision_no,
    d.old_rev,
    d.item_no,
    d.current_flg,
    CASE d.drawing_cls WHEN '0' THEN 'STD' WHEN '1' THEN 'PRE-STD' WHEN '2' THEN 'TMP' END AS drawing_cls_type,
    d.title_english,
    d.drawing_tool,
    d.remarks_1,
    d.remarks_2,
    CASE d.drawing_status WHEN '5' THEN 'Approved' WHEN '9' THEN 'Released' END AS drawing_status_text,
    d.local_approval_date,
    d.arrival_date_from_melina,
    d.start_term_ymj,
    d.reason_code,
    d.latest_released_flg,
    d.basket_id_org,
    b.draw_sectionname,
    b.draw_username,
    b.draw_username_sign,
    b.draw_datetime,
    b.approve_role,
    b.approve_userid,
    b.approve_sectionname,
    b.approve_username,
    b.approve_username_sign,
    b.approve_datetime
  `,
    )
    .from('drawing_fml', 'd')
    .leftJoin(
      'object_approval_fml',
      'b',
      `b.object_no = d.drawing_no
     AND b.revision_no = d.revision_no
     AND b.internal_revision_no = d.internal_revision_no`,
    );

    async yMelina(dto: SearchExpLocalPdmDto) {
      const { sdate, edate } = dto;
        const result = await this.baseQuery
        .where("d.drawing_no like 'Y%'")
        .andWhere("TO_CHAR(arrival_date_from_melina, 'YYYYMMDD') >= :sdate", { sdate })
        .andWhere("TO_CHAR(arrival_date_from_melina, 'YYYYMMDD') <= :edate", { edate })
        .orderBy('d.arrival_date_from_melina', 'ASC')
        .getRawMany();
      return result;
    }

    async yReleased(dto: SearchExpLocalPdmDto) {
      const { sdate, edate } = dto;
        const result = await this.baseQuery
        .where("d.drawing_no like 'Y%'")
        .andWhere("local_approval_date is not null ")
        .andWhere("drawing_status='9'")
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') >= :sdate", { sdate })
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') <= :edate", { edate })
        .orderBy('d.local_approval_date', 'ASC')
        .getRawMany();
      return result;
    }

    async yMelinaNotReleased(dto: SearchExpLocalPdmDto) {
      const { sdate, edate } = dto;
        const result = await this.baseQuery
        .where("d.drawing_no like 'Y%'")
        .andWhere("local_approval_date is null ")
        .andWhere("TO_CHAR(d.arrival_date_from_melina, 'YYYYMMDD') >= :sdate", { sdate })
        .andWhere("TO_CHAR(d.arrival_date_from_melina, 'YYYYMMDD') <= :edate", { edate })
        .orderBy('d.arrival_date_from_melina', 'ASC')
        .getRawMany();
      return result;
    }
    async yNotReleased() {
        const result = await this.baseQuery
        .where("d.drawing_no like 'Y%'")
        .andWhere("arrival_date_from_melina is null ")
        .andWhere("local_approval_date is null ")
        .andWhere("drawing_status='5'")
        .getRawMany();
      return result;
    }

    async kbNew(dto: SearchExpLocalPdmDto) {
      const { sdate, edate } = dto;
        const result = await this.baseQuery
        .addSelect("'NEW' AS create_class")
        .where("(d.drawing_no like 'B%' or  d.drawing_no like 'K%')")
        .andWhere("local_approval_date is not null ")
        .andWhere("drawing_status='9'")
        .andWhere("create_class='1' ")
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') >= :sdate", { sdate })
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') <= :edate", { edate })
        .orderBy('d.local_approval_date', 'ASC')
        .getRawMany();
      return result;
    }

    async kbRevise(dto: SearchExpLocalPdmDto) {
      const { sdate, edate } = dto;
        const result = await this.baseQuery
        .addSelect("'REVISE' AS create_class")
        .where("(d.drawing_no like 'B%' or  d.drawing_no like 'K%')")
        .andWhere("local_approval_date is not null ")
        .andWhere("drawing_status  IN ('5', '9')")
        .andWhere("create_class='2' ")
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') >= :sdate", { sdate })
        .andWhere("TO_CHAR(d.local_approval_date, 'YYYYMMDD') <= :edate", { edate })
        .orderBy('d.local_approval_date', 'ASC')
        .getRawMany();
      return result;
    }
}
