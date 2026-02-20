import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';

@Injectable()
export class WMSService {
    constructor(
        @InjectDataSource('sdsysConnection')
        private readonly db: DataSource,
    ) {}

    /**
     * Get WMS temp issue list by user
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     * @param   {string} empno Employee ID
     * @return  {Promise<WMSTempIssueDto[]>}
     */
    async getIssueList(empno: string): Promise<WMSTempIssueDto[]> {
        return this.db.query(`
            SELECT *
            FROM SDSYS.WMS_TEMPISSUE_TEST
            WHERE USERID = :1
            AND STATUS = '-'`, 
        [empno]);
    }
}
