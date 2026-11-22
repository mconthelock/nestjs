import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPO_SYNC_OUTBOX', schema: 'WEBFORM' })
export class PURPO_SYNC_OUTBOX {
    @PrimaryColumn({ name: 'EVENT_ID', type: 'varchar', length: 64 })
    EVENT_ID: string;

    @Column({ name: 'NFRMNO', type: 'int' })
    NFRMNO: number;

    @Column({ name: 'VORGNO', type: 'varchar', length: 20 })
    VORGNO: string;

    @Column({ name: 'CYEAR', type: 'varchar', length: 4 })
    CYEAR: string;

    @Column({ name: 'CYEAR2', type: 'varchar', length: 4 })
    CYEAR2: string;

    @Column({ name: 'NRUNNO', type: 'int' })
    NRUNNO: number;

    @Column({ name: 'ORD_ID', type: 'int' })
    ORD_ID: number;

    @Column({ name: 'EVENT_TYPE', type: 'varchar', length: 30 })
    EVENT_TYPE: string;

    @Column({ name: 'PAYLOAD_JSON', type: 'text' })
    PAYLOAD_JSON: string;

    @Column({ name: 'STATUS', type: 'varchar', length: 20, default: 'PENDING' })
    STATUS: string;

    @Column({ name: 'RETRY_COUNT', type: 'int', default: 0 })
    RETRY_COUNT: number;

    @Column({ name: 'LAST_ERROR', type: 'varchar', length: 1000, nullable: true })
    LAST_ERROR: string | null;

    @Column({ name: 'CREATED_AT', type: 'datetime', nullable: true })
    CREATED_AT: Date | null;

    @Column({ name: 'SYNCED_AT', type: 'datetime', nullable: true })
    SYNCED_AT: Date | null;
}
