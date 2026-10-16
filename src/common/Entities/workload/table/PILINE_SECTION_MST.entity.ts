import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PILINE_SECTION_MST', schema: 'WORKLOAD' })
export class PILINE_SECTION_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_SECTION' })
    SSECCODE: string;
}
