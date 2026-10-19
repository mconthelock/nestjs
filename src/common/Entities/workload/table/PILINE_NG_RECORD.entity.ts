import { Column, Entity, PrimaryColumn, JoinColumn, OneToOne } from 'typeorm';
import { PILINE_EVENT_RECORD } from './PILINE_EVENT_RECORD.entity';

@Entity({ name: 'PILINE_NG_RECORD', schema: 'WORKLOAD' })
export class PILINE_NG_RECORD {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_NG_RECORDD' })
    PILINE_NO: string;

    @Column()
    ID_TAG: string;

    @Column()
    QTY: number;

    @Column({ nullable: true })
    MAT_LOT: string | null;

    @Column({ nullable: true })
    MAT_NO: string | null;

    @Column({ nullable: true })
    REMARK_NG: string | null;

    @OneToOne(() => PILINE_EVENT_RECORD, { nullable: false })
    @JoinColumn({
        name: 'PILINE_NO',
        referencedColumnName: 'PILINE_NO',
        foreignKeyConstraintName: 'FK_PILINE_EVENT_RECORD',
    })
    EVENT_RECORD: PILINE_EVENT_RECORD;
}
