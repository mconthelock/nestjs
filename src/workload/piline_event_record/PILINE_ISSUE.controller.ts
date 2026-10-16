import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ConectionService } from 'src/as400/conection/conection.service';

/** Read-only lookups for the PI Line Reject Notice form. */
@Controller('workload/piline_issue')
export class PilineIssueController {
    constructor(private readonly as400: ConectionService,
        @InjectDataSource('webformConnection') private readonly webform: DataSource,
    ) {}

    @Get('reference')
    async checkReference(@Query('number') number: string) {
        const match = typeof number === 'string' ? /^(CN|PT|RQ)(\d{2})-(\d{6})$/.exec(number.trim().toUpperCase()) : null;
        if (!match) throw new BadRequestException('Invalid CN/PT/RQ number');
        const table = { CN: 'CNFORM', PT: 'PTFORM', RQ: 'RQFFRM' }[match[1]];
        const rows = await this.webform.query(
            `SELECT COUNT(*) AS TOTAL FROM WEBFORM.${table} WHERE CYEAR2 = :1 AND NRUNNO = :2`,
            ['20' + match[2], Number(match[3])],
        );
        return { status: true, data: { number: match[0], exists: Number(rows[0]?.TOTAL) > 0 } };
    }

    @Get('part')
    async findPart(@Query('order') order: string, @Query('drawing') drawing: string) {
        if (typeof order !== 'string' || typeof drawing !== 'string') {
            throw new BadRequestException('Order and Drawing are required');
        }
        const orderNo = order.trim().replace(/-/g, '');
        const drawingNo = drawing.replace(/\s/g, '');
        if (!orderNo || !drawingNo || orderNo.length > 40 || drawingNo.length > 120) {
            throw new BadRequestException('Invalid Order or Drawing');
        }
        const data = await this.as400.runQuery(`
            SELECT DISTINCT Q9PRJ AS PROJ, Q41K02 AS PROD, Q41K03 AS ITEM,
                Q41K10 AS PART, Q9TYP AS MODEL
            FROM RTNLIBF.Q90010P2
            INNER JOIN RTNLIBF.Q141KP ON Q9ORD = Q41K01
            WHERE Q41K01 = ? AND REPLACE(Q41K08, ' ', '') = ?
            ORDER BY PROD, ITEM
        `, [orderNo, drawingNo]);
        return { status: true, data };
    }
}
