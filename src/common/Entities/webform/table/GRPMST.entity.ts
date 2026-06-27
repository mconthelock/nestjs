import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'GRPMST', schema: 'WEBFORM' })
export class GRPMST {
    @PrimaryColumn()
    GRPNO: string;

    @Column()
    GRPNAME: string;
}
