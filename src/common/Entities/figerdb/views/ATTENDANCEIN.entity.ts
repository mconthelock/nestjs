import {
    ViewEntity,
    PrimaryColumn,
    ViewColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

@ViewEntity({
    name: 'HRSYSTEM_ATTENDANCE_IN',
    schema: 'dbo',
})
export class AttendanceIn {
    @ViewColumn()
    datetimes: Date;

    @ViewColumn()
    users: string;

    @ViewColumn()
    FirstName: string;

    @ViewColumn()
    Lastname: string;

    @ViewColumn()
    FunctionKeyCode: string;

    @ViewColumn()
    workingdate: Date;

    @ViewColumn()
    SDATE: Date;

    @ViewColumn()
    STIME: string;

    @ViewColumn()
    REMARK: string;

    @ViewColumn()
    RECODE: string;
}
