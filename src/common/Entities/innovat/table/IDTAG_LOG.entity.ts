import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'IDTAG_LOG', schema: 'INNOVAT' })
export class IDTAG_LOG {
    @PrimaryColumn()
    CONTROL: string;

    @PrimaryColumn()
    PROCESS: string;

    @Column({ nullable: true })
    PERIOD: string;

    @Column({ nullable: true })
    FINISH_DATE: number;

    @Column({ nullable: true })
    REMARK: string;

    @Column()
    EMPNO: string;

    @Column()
    STATUS: number;

    @Column()
    CREATE_DATE: Date;

    @Column({ nullable: true })
    UPDATE_DATE: Date;
}
