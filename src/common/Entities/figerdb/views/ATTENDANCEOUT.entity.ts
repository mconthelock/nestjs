import {
    ViewEntity,
    PrimaryColumn,
    ViewColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

@ViewEntity({
    name: 'HRSYSTEM_ATTENDANCE_OUT',
    schema: 'dbo',
})
export class AttendanceOut {
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
