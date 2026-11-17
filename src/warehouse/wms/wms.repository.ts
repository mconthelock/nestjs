import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { WMS_TEMPISSUE } from 'src/common/Entities/sdsys/views/WMS_TEMPISSUE.entity';
import { WMSUploadIssueDto } from './dto/wms-upload-issue.dto';
import { WMSUploadIssueResponseDto } from './dto/wms-upload-issue-response.dto';

@Injectable()
export class WMSRepository extends BaseRepository {
    private readonly orepo: OracleRepository;

    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
        this.orepo = new OracleRepository(ds);
    }

    getIssueList(empno: string) {
        return this.getRepository(WMS_TEMPISSUE)
            .createQueryBuilder('A')
            .select([
                'A.USERID',
                'A.STATUS',
                'A.ISSUE',
                'A.ITEMCODE',
                'A.ONHAND',
                'A.DESCRIPTION',
                'A.PROD',
                'A.LOCATION',
                'A.QTY',
                'A.ISSUETO',
                'A.PO',
                'A.LINE',
                'A.INV',
                'A.PALLET_ID',
                'A.EXPIRE_DATE',
            ])
            .where('A.USERID = :empno', { empno })
            .andWhere('A.STATUS = :status', { status: '-' })
            .orderBy('A.LOCATION', 'ASC')
            .addOrderBy('A.PALLET_ID', 'ASC')
            .addOrderBy('A.EXPIRE_DATE', 'ASC')
            .addOrderBy('A.ISSUE', 'ASC')
            .getMany();
    }

    async uploadIssue(
        dto: WMSUploadIssueDto,
    ): Promise<WMSUploadIssueResponseDto> {
        const paramOrder = ['location', 'palletId', 'expireDate',];
        const result = await this.orepo.execCursor('WMS_UPLOAD_ISSUE', dto, paramOrder);
        return result?.[0];
    }
}