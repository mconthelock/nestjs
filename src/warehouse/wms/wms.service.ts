import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm'; 
import { BIND_OUT, CURSOR, OUT_FORMAT_OBJECT } from 'oracledb';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';
import { WMSUploadIssueDto } from './dto/wms-upload-issue.dto';

@Injectable()
export class WMSService {
    constructor(
        @InjectDataSource('sdsysConnection')
        private readonly db: DataSource,
    ) {}

    /**
     * Get issue list
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     * @param   {string} empno Employee ID
     * @return  {Promise<WMSTempIssueDto[]>}
     */
    async getIssueList(empno: string): Promise<WMSTempIssueDto[]> {
        return this.db.query(
            `
             SELECT USERID, STATUS, ISSUE, ITEMCODE, DESCRIPTION, PROD, LOCATION, QTY, ISSUETO, PO, LINE, INV, PALLET_ID, EXPIRE_DATE
             FROM WMS_TEMPISSUE_TEST
             WHERE USERID = :1
                AND STATUS = '-'
             ORDER BY LOCATION ASC, PALLET_ID ASC, EXPIRE_DATE ASC, ISSUE ASC
            `, 
            [empno]
        );
    }

    /**
     * Upload issue
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-24
     * @param   {WMSUploadIssueDto} dto Upload issue data
     * @return  {Promise<string>}
     */
    async uploadIssue(dto: WMSUploadIssueDto): Promise<string> {
        const runner = this.db.createQueryRunner();
        await runner.connect();
        const connection: any = (runner as any).databaseConnection;
        
        try {
            const res = await connection.execute(
                `BEGIN WMS_UPLOAD_ISSUE(:location, :palletId, :expireDate, :out_cursor); END;`,
                {
                    location: dto.location,
                    palletId: dto.palletId,
                    expireDate: dto.expireDate,
                    out_cursor: { dir: BIND_OUT, type: CURSOR },
                },
                { outFormat: OUT_FORMAT_OBJECT }
            );

            const cursor = res.outBinds.out_cursor;
            const rows = await cursor.getRows();
            await cursor.close();
            return rows[0]?.STATUS ?? 'ERROR';
        } catch (error) {
            return 'ERROR';
        } finally {
            await runner.release();
        }
    }
}
