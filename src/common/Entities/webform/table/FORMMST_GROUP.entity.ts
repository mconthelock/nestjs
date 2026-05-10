import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'FORMMST_GROUP', schema: 'WEBFORM' })
export class FORMMST_GROUP {
    @PrimaryColumn()
    VGROUPORG: string;

    @PrimaryColumn()
    VGROUP: string;

    @PrimaryColumn()
    VGROUPNAME: string;
}
