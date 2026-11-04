import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity({ name: 'SP_INQUIRY_CONTROL', schema: 'SPSYS' })
export class InquiryControl {
    @PrimaryColumn()
    CNT_PREFIX: string;

    @PrimaryColumn()
    CNT_AGENT: string;

    @PrimaryColumn()
    CNT_TRADER: string;

    @Column()
    CNT_QUOTATION: number;

    @Column()
    CNT_TERM: number;

    @Column()
    CNT_WEIGHT: number;

    @Column()
    CNT_METHOD: number;
}
