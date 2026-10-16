import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PILINE_ATT', schema: 'WORKLOAD' })
export class PILINE_ATT {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_ATT' })
    PILINE_NO: string;

    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_ATT' })
    SEQ: number;

    @Column()
    FILENAME: string;

    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_ATT' })
    TYPEFILE: string;
}
