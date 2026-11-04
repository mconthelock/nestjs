import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MASTER_ZINC_PR } from './MASTER_ZINC_PR.entity';

@Entity({ name: 'TKO_TAKEOUTDETAIL', schema: 'SKIDCNTRL' })
export class TKO_TAKEOUTDETAIL {
    @PrimaryColumn({ type: 'varchar2', length: 50 })
    TDETAIL_TAKEOUTNO: string;

    @PrimaryColumn({ type: 'number', precision: 38, scale: 0 })
    TDETAIL_ITEMNO: number;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    TDETAIL_INPUTTYPE: string;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    TDETAIL_VALUE: string;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    TDETAIL_EQTYPE: string;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    TDETAIL_PROD: string;

    @Column({ type: 'varchar2', length: 100 })
    TDETAIL_ITEM: string;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    TDETAIL_DWG: string;

    @Column({ type: 'number', nullable: true })
    TDETAIL_QTY: number;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    TDETAIL_ISSUETO: string;

    @Column({ type: 'number', nullable: true })
    TDETAIL_WEIGHT: number;

    @Column({ type: 'varchar2', length: 150, nullable: true })
    TDETAIL_SPEC: string;

    @Column({ type: 'varchar2', length: 200, nullable: true })
    TDETAIL_SIZE: string;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    TDETAIL_COLOR: string;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    TDETAIL_NO: string;

    @Column({ type: 'nvarchar2', length: 200, nullable: true })
    TDETAIL_DESC: string;

    @Column({ type: 'varchar2', length: 200, nullable: true })
    TDETAIL_REMARK: string;

    @Column({ type: 'number', precision: 20, scale: 4, nullable: true })
    TDETAIL_WEIGHT_ADJUST: number;

    @Column({ type: 'number', precision: 10, scale: 0, nullable: true })
    TDETAIL_QTY_ADJUST: number;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    TDETAIL_UPDUSER: string;

    @Column({ type: 'date', nullable: true })
    TDETAIL_UPDDATE: Date;

    @Column({ type: 'number', precision: 1, scale: 0, default: 0, nullable: true })
    TDETAIL_DEL: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    TDETAIL_CDATE: Date;

    @Column({ type: 'number', precision: 10, scale: 0, default: 0, nullable: true })
    TDETAIL_RETURN_QTY: number;

    @Column({ type: 'varchar2', length: 500, nullable: true })
    TDETAIL_REMARK_ADJUST: string;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    TDETAIL_PURREF: string;

    @Column({ type: 'varchar2', length: 1, default: '0', nullable: true })
    TDETAIL_PR_STATUS: string;

    MASTER_ZINC_PR: MASTER_ZINC_PR[];
}