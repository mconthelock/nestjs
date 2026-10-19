import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'PILINE_EVENT_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_EVENT', ['MAIN_CATEGORY', 'EVENT_TYPE', 'PRODUCTION_IMPACT'])
export class PILINE_EVENT_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_EVENT' })
    EVENT_ID: number;

    @Column()
    MAIN_CATEGORY: string;

    @Column()
    EVENT_TYPE: string;

    @Column()
    PRODUCTION_IMPACT: string;

    @Column({ default: '1' })
    STATUS: string;
}
