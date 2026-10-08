import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'REPORT_PERMISSION', schema: 'GPREPORT' })
export class ReportPermission {
    @PrimaryColumn()
    USERS: string;

    @Column()
    REPORTTYPE: string;

    @Column()
    SECTION: string;

    @Column()
    DEPARTMENT: string;

    @Column()
    DIVISION: string;

    @Column()
    SUPPER: string;
}
