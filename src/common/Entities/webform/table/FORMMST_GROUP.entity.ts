import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'FORMMST_GROUP', schema: 'WEBFORM' })
export class FORMMST_GROUP {
    @PrimaryColumn()
    VGROUPORG: string;

    @PrimaryColumn()
    VGROUP: string;

    @Column()
    VGROUPNAME: string;
}
