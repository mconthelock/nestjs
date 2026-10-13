import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'PILINE_CAUSE_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_CAUSE', ['CAUSE_NAME'])
export class PILINE_CAUSE_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_CAUSE' })
    CAUSE_ID: number;

    @Column()
    CAUSE_NAME: string;

    @Column({ default: '1' })
    STATUS: string;
}
