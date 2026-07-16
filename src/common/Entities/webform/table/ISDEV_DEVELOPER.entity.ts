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
    DEV_SEQ: number;

    @Column()
    DEV_PIC: string;

    @Column({ type: 'decimal', precision: 7, scale: 2 })
    DEV_PLANTIME: number;

    @Column()
    DEV_PLANSTART: Date;

    @Column()
    DEV_PLANEND: Date;

    @Column({ type: 'decimal', precision: 7, scale: 2 })
    DEV_ACTUALTIME: number;

    @Column()
    DEV_ACTUALSTART: Date;

    @Column()
    DEV_ACTUALEND: Date;

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
