import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISCFS_FORM', schema: 'WEBFORM' })
export class ISCFS_FORM {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    CFS_REQUESTER: string;

    @Column()
    CFS_SYSCODE: string;

    @Column()
    CFS_DIVCODE: string;

    @Column()
    CFS_PROTID: string;

    @Column()
    CFS_PROMID: number;

    @Column()
    CFS_SYSNAME: string;

    @Column()
    CFS_REQNO: string;

    @Column()
    CFS_TID_REQNO: string;

    @Column()
    CFS_WORKCONTENT: string;

    @Column()
    CFS_CREATEDATE: Date;
}
