import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';

import { ISDEV_REQUEST } from './ISDEV_REQUEST.entity';
@Entity({
    name: 'IS_FILE',
    schema: 'WEBFORM',
})
export class IS_FILE {
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

    @PrimaryColumn()
    FILE_ID: number;

    @Column()
    FILE_ONAME: string;

    @Column()
    FILE_FNAME: string;

    @Column()
    FILE_USERCREATE: string;

    @Column()
    FILE_DATECREATE: Date;

    @Column()
    FILE_USERUPDATE: string;

    @Column()
    FILE_DATEUPDATE: Date;

    @Column()
    FILE_TYPE: number;

    @Column()
    FILE_STATUS: number;

    @Column()
    FILE_PATH: string;

    //IS-DEV: Development Request Form
    @ManyToOne(() => ISDEV_REQUEST, (file) => file.files)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    devreq: ISDEV_REQUEST;
}
