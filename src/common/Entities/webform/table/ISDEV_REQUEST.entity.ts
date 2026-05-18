import {
    Column,
    Entity,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
} from 'typeorm';

import { ISDEV_CATEGORY } from './ISDEV_CATEGORY.entity';
import { ISDEV_OBJECTIVE } from './ISDEV_OBJECTIVE.entity';
import { ISDEV_STATUS } from './ISDEV_STATUS.entity';
import { ISDEV_TYPE } from './ISDEV_TYPE.entity';
import { User } from 'src/amec/users/entities/user.entity';
import { ISDEV_DEVELOPER } from './ISDEV_DEVELOPER.entity';

@Entity({ name: 'ISDEV_REQUEST', schema: 'WEBFORM' })
export class ISDEV_REQUEST {
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
    OBJECTIVE: number;

    @Column()
    OBJECTIVE_OTHER: string;

    @Column()
    CATEGORY: number;

    @Column()
    JOBTYPE: number;

    @Column()
    STATUS: number;

    @Column()
    PLANYEAR: number;

    @Column()
    SYSTEMNAME: string;

    @Column()
    TITLE: string;

    @Column()
    REQ_ORG: string;

    @Column()
    REQ_PIC: string;

    @Column()
    REQ_DATE: Date;

    @Column()
    SPEC_CONFIRM_PLAN: Date;

    @Column()
    SPEC_CONFIRM_ACTUAL: Date;

    @Column()
    DEV_START_PLAN: Date;

    @Column()
    DEV_END_PLAN: Date;

    @Column()
    DEV_START_ACTUAL: Date;

    @Column()
    DEV_END_ACTUAL: Date;

    @Column()
    PURPOSE: string;

    @Column()
    CURRENT_WORKFLOW: string;

    @Column()
    EXPECTED_WORKFLOW: string;

    @Column()
    IS_ITGC: string;

    @ManyToOne(() => ISDEV_CATEGORY)
    @JoinColumn([{ name: 'CATEGORY', referencedColumnName: 'CATEGORY_ID' }])
    category: ISDEV_CATEGORY;

    @ManyToOne(() => ISDEV_OBJECTIVE)
    @JoinColumn([{ name: 'OBJECTIVE', referencedColumnName: 'OBJ_ID' }])
    obj: ISDEV_OBJECTIVE;

    @ManyToOne(() => ISDEV_STATUS)
    @JoinColumn([{ name: 'STATUS', referencedColumnName: 'STATUS_ID' }])
    status: ISDEV_STATUS;

    @ManyToOne(() => ISDEV_TYPE)
    @JoinColumn([{ name: 'JOBTYPE', referencedColumnName: 'TYPE_ID' }])
    type: ISDEV_TYPE;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'REQ_PIC', referencedColumnName: 'SEMPNO' }])
    requester: User;

    @OneToMany(() => ISDEV_DEVELOPER, (dev) => dev.request)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    developers: ISDEV_DEVELOPER[];
}
