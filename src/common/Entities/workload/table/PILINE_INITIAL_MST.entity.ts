import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'PILINE_INITIAL_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_INITIAL', ['INITIAL_DETAIL'])
export class PILINE_INITIAL_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_INITIAL' })
    INITIAL_ID: number;

    @Column()
    INITIAL_DETAIL: string;

    @Column({ default: '1' })
    STATUS: string;
}
