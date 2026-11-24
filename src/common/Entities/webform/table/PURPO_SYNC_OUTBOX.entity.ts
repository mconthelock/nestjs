import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPO_SYNC_OUTBOX', schema: 'WEBFORM' })
export class PURPO_SYNC_OUTBOX {
    @Column()
    NFRMNO: number;

    @Column()
    VORGNO: string;

    @Column()
    CYEAR: string;

    @Column()
    CYEAR2: string;

    @Column()
    NRUNNO: number;

    @PrimaryColumn()
    EVENT_ID: string;

    @Column()
    ORD_ID: number;

    @Column()
    EVENT_TYPE: string;

    @Column()
    PAYLOAD_JSON: string;

    @Column()
    STATUS: string;

    @Column()
    RETRY_COUNT: number;

    @Column()
    LAST_ERROR: string | null;

    @Column()
    CREATED_AT: Date | null;

    @Column()
    SYNCED_AT: Date | null;
}
