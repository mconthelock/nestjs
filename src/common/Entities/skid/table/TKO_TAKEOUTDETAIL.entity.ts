import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MASTER_ZINC_PR } from './MASTER_ZINC_PR.entity';

@Entity({ name: 'TKO_TAKEOUTDETAIL', schema: 'SKIDCNTRL' })
export class TKO_TAKEOUTDETAIL {
    @PrimaryColumn({ length: 50 })
    TDETAIL_TAKEOUTNO: string;

    @PrimaryColumn({ precision: 38, scale: 0 })
    TDETAIL_ITEMNO: number;

    @Column({ length: 20, nullable: true })
    TDETAIL_INPUTTYPE: string;

    @Column({ length: 50, nullable: true })
    TDETAIL_VALUE: string;

    @Column({ length: 20, nullable: true })
    TDETAIL_EQTYPE: string;

    @Column({ length: 20, nullable: true })
    TDETAIL_PROD: string;

    @Column({ length: 100 })
    TDETAIL_ITEM: string;

    @Column({ length: 100, nullable: true })
    TDETAIL_DWG: string;

    @Column({ nullable: true })
    TDETAIL_QTY: number;

    @Column({ length: 50, nullable: true })
    TDETAIL_ISSUETO: string;

    @Column({ nullable: true })
    TDETAIL_WEIGHT: number;

    @Column({ length: 150, nullable: true })
    TDETAIL_SPEC: string;

    @Column({ length: 200, nullable: true })
    TDETAIL_SIZE: string;

    @Column({ length: 50, nullable: true })
    TDETAIL_COLOR: string;

    @Column({ length: 100, nullable: true })
    TDETAIL_NO: string;

    @Column({ length: 200, nullable: true })
    TDETAIL_DESC: string;

    @Column({ length: 200, nullable: true })
    TDETAIL_REMARK: string;

    @Column({ precision: 20, scale: 4, nullable: true })
    TDETAIL_WEIGHT_ADJUST: number;

    @Column({ precision: 10, scale: 0, nullable: true })
    TDETAIL_QTY_ADJUST: number;

    @Column({ length: 10, nullable: true })
    TDETAIL_UPDUSER: string;

    @Column({ type: 'date', nullable: true })
    TDETAIL_UPDDATE: Date;

    @Column({ precision: 1, scale: 0, default: 0, nullable: true })
    TDETAIL_DEL: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    TDETAIL_CDATE: Date;

    @Column({ precision: 10, scale: 0, default: 0, nullable: true })
    TDETAIL_RETURN_QTY: number;

    @Column({ length: 500, nullable: true })
    TDETAIL_REMARK_ADJUST: string;

    @Column({ length: 20, nullable: true })
    TDETAIL_PURREF: string;

    @Column({ length: 1, default: '0', nullable: true })
    TDETAIL_PR_STATUS: string;

    MASTER_ZINC_PR: MASTER_ZINC_PR[];
}
