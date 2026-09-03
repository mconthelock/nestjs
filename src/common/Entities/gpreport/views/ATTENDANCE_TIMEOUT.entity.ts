// FUNCTIONKEY	CHAR(4)
// WORKINGDATE	VARCHAR2(10)
// DATEIN	VARCHAR2()
// TIMESIN	VARCHAR2()
// DATEOUT	VARCHAR2(10)
// TIMESOUT	VARCHAR2(8)
// REMARK	VARCHAR2(253)
// REQ	VARCHAR2(10)
// DATETIMES	VARCHAR2(19)
// SEMPNO	VARCHAR2(12)
// FIRSTNAME	VARCHAR2(120)
// LASTNAME	VARCHAR2(120)
import { ViewColumn, ViewEntity } from 'typeorm';
@ViewEntity({ name: 'ATTENDANCE_TIMEOUT', schema: 'GPREPORT' })
export class AttendanceTimeOut {
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

    @ViewColumn()
    FIRSTNAME: string;

    @ViewColumn()
    LASTNAME: string;
}
