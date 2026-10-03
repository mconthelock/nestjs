import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MACHINE_ABILITY_PROCESS' })
export class MachineAbilityProcess {
    @PrimaryColumn()
    MID: number;

    @PrimaryColumn()
    MA_CODE: string;

    @PrimaryColumn()
    PROCESS: string;

    @Column()
    SPEC: string | null;

    @Column()
    USAGE: string | null;

    @Column()
    STATUS: string | null;

    @Column()
    LAST_UPDATE: Date | null;

    @Column()
    ACTION_STATUS: string | null;

    @Column()
    CYEAR2_REF: string | null;

    @Column()
    NRUNNO_REF: number | null;
}