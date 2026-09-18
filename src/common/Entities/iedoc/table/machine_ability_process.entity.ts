import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MACHINE_ABILITY_PROCESS' })
export class MachineAbilityProcess {
    @PrimaryColumn({ type: 'number', precision: 3, scale: 0 })
    MID: number;

    @PrimaryColumn({ type: 'varchar2', length: 5 })
    MA_CODE: string;

    @PrimaryColumn({ type: 'varchar2', length: 10 })
    PROCESS: string;

    @Column({ type: 'varchar2', length: 2000, nullable: true })
    SPEC: string | null;

    @Column({ type: 'varchar2', length: 2000, nullable: true })
    USAGE: string | null;

    @Column({ type: 'varchar2', length: 1, nullable: true })
    STATUS: string | null;

    @Column({ type: 'date', nullable: true })
    LAST_UPDATE: Date | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    ACTION_STATUS: string | null;

    @Column({ type: 'char', length: 4, nullable: true })
    CYEAR2_REF: string | null;

    @Column({ type: 'number', precision: 7, scale: 0, nullable: true })
    NRUNNO_REF: number | null;
}
