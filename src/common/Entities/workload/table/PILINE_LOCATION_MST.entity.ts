import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'PILINE_LOCATION_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_LOCATION', ['LOCATION_NAME'])
export class PILINE_LOCATION_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_LOCATION' })
    LOCATION_ID: number;

    @Column()
    LOCATION_NAME: string;

    @Column({ default: '1' })
    STATUS: string;
}
