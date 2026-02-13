import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WMSTempIssueEntity } from 'src/common/Entities/sdsys/table/WMS_TEMPISSUE.entity';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';

@Injectable()
export class WMSService {
    constructor(
        @InjectRepository(WMSTempIssueEntity, 'sdsysConnection')
        private readonly db: Repository<WMSTempIssueEntity>,
    ) {}

    /**
     * Get WMS temp issue list by user
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     * @param   {string} empno Employee ID
     * @return  {Promise<WMSTempIssueDto[]>}
     */
    async getIssueList(empno: string): Promise<WMSTempIssueDto[]> {
        return this.db.find({
            where: {
                USERID: empno,
                STATUS: '-',
            },
            order: {
                LOCATION: 'ASC',
            },
        });
    }
}
