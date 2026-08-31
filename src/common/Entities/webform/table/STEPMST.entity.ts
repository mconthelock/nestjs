import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STEPMST', schema: 'WEBFORM' })
export class STEPMST {
    @PrimaryColumn()
    CNO: string;

    @Column()
    VNAME: string;

    @Column()
    VDESC: string;
}
