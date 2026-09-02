import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TOOL_WITHDRAWAL } from './TOOL_WITHDRAWAL.entity';
import { TOOL_REFILL } from './TOOL_REFILL.entity';
import { OneToMany } from 'typeorm';

@Entity({ name: 'TOOL_IMPORT_HISTORY', schema: 'SKIDCNTRL' })
export class TOOL_IMPORT_HISTORY {
    @PrimaryGeneratedColumn()
    IMPORT_ID: number;

    @Column()
    FILE_NAME: string;

    @Column()
    IMPORT_DATE: Date;

    @Column()
    IMPORT_BY: string;

    @Column()
    STATUS: string;

    @Column()
    CREATED_AT: Date;

    @Column()
    UPDATED_AT: Date;

    @OneToMany(() => TOOL_WITHDRAWAL, (wd) => wd.IMPORT_HISTORY)
    WITHDRAWALS: TOOL_WITHDRAWAL[];

    @OneToMany(() => TOOL_REFILL, (rf) => rf.IMPORT_HISTORY)
    REFILLS: TOOL_REFILL[];
}
