// FIRSTNAME	VARCHAR2(120)
// LASTNAME	VARCHAR2(120)
// FUNCTIONKEY	CHAR(4)
// WORKINGDATE	VARCHAR2(10)
// DATEIN	VARCHAR2(10)
// TIMESIN	VARCHAR2(8)
// DATEOUT	VARCHAR2()
// TIMESOUT	VARCHAR2()
// REMARK	VARCHAR2(253)
// REQ	VARCHAR2(10)
// DATETIMES	VARCHAR2(19)
// SEMPNO	VARCHAR2(12)

import { ViewColumn, ViewEntity } from 'typeorm';
@ViewEntity({ name: 'ATTENDANCE_TIMEIN', schema: 'GPREPORT' })
export class AttendanceTimeIn {
    @ViewColumn()
    FIRSTNAME: string;

    @ViewColumn()
    LASTNAME: string;

    @ViewColumn()
    FUNCTIONKEY: string;

    @ViewColumn()
    WORKINGDATE: string;

    @ViewColumn()
    DATEIN: string;

    @ViewColumn()
    TIMESIN: string;

    @ViewColumn()
    DATEOUT: string;

    @ViewColumn()
    TIMESOUT: string;

    @ViewColumn()
    REMARK: string;

    @ViewColumn()
    REQ: string;

    @ViewColumn()
    DATETIMES: string;

    @ViewColumn()
    SEMPNO: string;
}
