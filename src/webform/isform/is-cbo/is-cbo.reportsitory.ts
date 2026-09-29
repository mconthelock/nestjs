import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class IsCboRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
    ) {
        super(ds);
    }

    async getListBringOut(vreqno: string) {
        return this.ds.query(
            `
                SELECT * FROM FORM f
                JOIN FLOW f2 ON f.NFRMNO = f2.NFRMNO AND f.VORGNO = f2.VORGNO AND f.CYEAR = f2.CYEAR AND f.CYEAR2 = f2.cyear2 AND f.NRUNNO = f2.NRUNNO
                JOIN CR_COM_REVISE_HEAD ccrh ON f.NFRMNO = ccrh.NFRMNO AND f.VORGNO = ccrh.VORGNO AND f.CYEAR = ccrh.CYEAR AND f.CYEAR2 = ccrh.cyear2 AND f.NRUNNO = ccrh.NRUNNO
                LEFT JOIN CR_COM_REVISE_DETAIL_DEVICE crd ON  f.NFRMNO = crd.NFRMNO AND f.VORGNO = crd.VORGNO AND f.CYEAR = crd.CYEAR AND f.CYEAR2 = crd.cyear2 AND f.NRUNNO = crd.NRUNNO AND crd.DNO IN ('1','2')
                LEFT JOIN CR_DEVICEMST cd ON crd.DNO = cd.DNO
                WHERE (VREQNO = :1 OR VINPUTER = :1) AND CSTEPNO = '02' AND TRUNC(SYSDATE) BETWEEN TRUNC(ccrh.STARTDATE) AND TRUNC(ccrh.ENDDATE)
            `,
            [vreqno],
        );
    }

    async getDevice(uid: string) {
        return this.ds.query(
            `
                SELECT * FROM SWRULE.pcdetail pc
                WHERE pc.UID_ID = :1
            `,
            [uid],
        );
    }
}
