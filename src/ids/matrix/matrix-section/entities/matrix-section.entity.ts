import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('MATRIX_SECTION')
export class MatrixSection {
    @PrimaryColumn()
    ID: number;

    @Column()
    NAME: string;

    @Column()
    STATUS: number;
}
