import {
    Column,
    Entity,
    PrimaryColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ISDEV_REQUEST } from './ISDEV_REQUEST.entity';
import { User } from 'src/amec/users/entities/user.entity';

@Entity({ name: 'ISDEV_DEVELOPER', schema: 'WEBFORM' })
export class ISDEV_DEVELOPER {
    @PrimaryColumn()
    NFRMNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: string;

    @PrimaryColumn()
    DEV_SEQ: string;

    @Column()
    DEV_PIC: string;

    @Column()
    DEV_PLANTIME: string;

    @Column()
    DEV_PLANSTART: string;

    @Column()
    DEV_PLANEEND: string;

    @Column()
    DEV_ACTUALTIME: string;

    @Column()
    DEV_ACTUALSTART: string;

    @Column()
    DEV_ACTUALEND: string;

    @Column()
    DEV_TITLE: string;

    @ManyToOne(() => ISDEV_REQUEST, (form) => form.developers)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    request: ISDEV_REQUEST;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'DEV_PIC', referencedColumnName: 'SEMPNO' }])
    info: User;
}
