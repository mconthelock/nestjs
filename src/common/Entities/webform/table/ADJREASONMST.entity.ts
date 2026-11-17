import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'ADJREASONMST', schema: 'WEBFORM' })
export class ADJREASONMST {
    @PrimaryColumn({ type: 'char', length: 1 })
    REASONNO: string;

    @Column({ type: 'varchar2', length: 25, nullable: true })
    REASON: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    CSTDESC: string | null;
}
