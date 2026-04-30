import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STY_PATROL', schema: 'GPREPORT' })
export class STY_PATROL {
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
    PA_ID: number;

    @Column()
    PA_OWNER: string;

    @Column()
    PA_DATE: Date;

    @Column()
    PA_SECTION: string;

    @Column()
    PA_AUDIT: string;

    @Column()
    PA_ITEMS: number;

    @Column()
    PA_AREA: string;

    @Column()
    PA_DETECTED: string;

    @Column()
    PA_IMAGE: number;

    @Column()
    PA_CLASS: number;

    @Column()
    PA_SUGGESTION: string;

    @Column()
    PA_EMP_CORRECTIVE: string;

    @Column()
    PA_CORRECTIVE: string;

    @Column()
    PA_FINISH_DATE: Date;

    @Column()
    PA_MORNING_TALK: Date;

    @Column()
    PA_AUDIT_EVALUATE: number;

    @Column()
    PA_USERCREATE: string;

    @Column()
    PA_DATECREATE: Date;

    @Column()
    PA_MAT: number;

    @Column()
    PA_IMAGE_AFTER: number;
}
