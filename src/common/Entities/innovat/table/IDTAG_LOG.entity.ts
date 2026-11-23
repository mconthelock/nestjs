import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'IDTAG_LOG', schema: 'INNOVAT' })
export class IDTAG_LOG {
    @PrimaryColumn()
    CONTROL: string;

    @PrimaryColumn()
    PROCESS: string;

    @Column()
    PERIOD: string;

    @Column()
    FINISH_DATE: number;

    @Column()
    REMARK: string;

    @Column()
    EMPNO: string;

    @Column()
    STATUS: number;

    @Column()
    CREATE_DATE: Date;

    @Column()
    UPDATE_DATE: Date;

    @Column()
    IP_ADDRESS: string;
}
