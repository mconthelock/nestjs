import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'WORK_STATUS', schema: 'DOCINV' })
export class IsWorkStatus {
    @PrimaryColumn()
    STATUS_ID: number;

    @Column()
    STATUS_ACTION: string;

    @Column()
    STATUS_DESC: string;

    @PrimaryColumn()
    STATUS_CLASS: string;
}
