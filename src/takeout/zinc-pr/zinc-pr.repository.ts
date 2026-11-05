import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ZincPrRepository {
	constructor(@InjectDataSource('webformConnection') private readonly dataSource: DataSource) {}

	findPending(date?: string) {
		const dateFilter = date
			? "AND TO_CHAR(td.TDETAIL_CDATE, 'YYYY-MM-DD') = :1"
			: '';
		const sql = `SELECT
			td.TDETAIL_TAKEOUTNO,
			mzp.ITEM_MASTER,
			SUM(td.TDETAIL_WEIGHT_ADJUST) AS TOTAL_WEIGHT_ADJUST,
			SUBSTR(td.TDETAIL_REMARK, 1, 6) AS PROCESS,
			MAX(td.TDETAIL_PROD) AS MAX_PROD,
			mzp.ITEM,
			mzp.DWGNO,
			mzp.DESCRIPTION
		FROM SKIDCNTRL.TKO_TAKEOUTDETAIL td
		LEFT JOIN SKIDCNTRL.MASTER_ZINC_PR mzp
			ON mzp.PROCESS = SUBSTR(td.TDETAIL_REMARK, 1, 6)
		LEFT JOIN SKIDCNTRL.TKO_TAKEOUTSLIP tt
			ON tt.TAKEOUT_NO = td.TDETAIL_TAKEOUTNO
		WHERE td.TDETAIL_INPUTTYPE = '1'
			AND td.TDETAIL_REMARK LIKE '**ME%'
			AND td.TDETAIL_DEL = 0
			AND td.TDETAIL_PR_STATUS = '0'
			AND tt.TAKEOUT_VENDOR = '80035'
			${dateFilter}
		GROUP BY
			SUBSTR(td.TDETAIL_REMARK, 1, 6),
			td.TDETAIL_TAKEOUTNO,
			mzp.ITEM_MASTER,
			mzp.ITEM,
			mzp.DWGNO,
			mzp.DESCRIPTION
		ORDER BY td.TDETAIL_TAKEOUTNO ASC`;

		return this.dataSource.query(sql, date ? [date] : []);
	}

	markSubmitted(takeoutNos: string[]) {
		if (takeoutNos.length === 0) {
			return Promise.resolve([]);
		}

		const placeholders = takeoutNos.map((_, index) => `:${index + 1}`).join(', ');
		const sql = `UPDATE SKIDCNTRL.TKO_TAKEOUTDETAIL
			SET TDETAIL_PR_STATUS = '1'
			WHERE TDETAIL_TAKEOUTNO IN (${placeholders})
				AND TDETAIL_INPUTTYPE = '1'
				AND TDETAIL_REMARK LIKE '**ME%'
				AND TDETAIL_DEL = 0
				AND TDETAIL_PR_STATUS = '0'`;

		return this.dataSource.query(sql, takeoutNos);
	}
}
