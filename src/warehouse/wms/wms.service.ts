import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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
            `, 
            [empno]
        );
    }

    /**
     * Upload issue
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-21
     * @param   {WMSUploadIssueDto} dto Upload issue data
     * @return  {Promise<string>}
     */
    async uploadIssue(dto: WMSUploadIssueDto): Promise<string> {
        // const result = await this.db.query(
        //     `
        //     UPDATE WMS_TEMPISSUE_TEST
        //     SET STATUS = 'OK'
        //     WHERE LOCATION = :1
        //     AND PALLET_ID = :2
        //     AND EXPIRE_DATE = :3
        //     AND STATUS = '-'
        //     `,
        //     [
        //         dto.location,
        //         dto.palletId,
        //         dto.expireDate,
        //     ],
        // );

        // const affected = result?.rowsAffected ?? 0;
        // if (affected === 0) {
        //     return 'NOTFOUND';
        // }

        return 'UPDATED';
    }
}
