import { Entity, PrimaryColumn , Column } from 'typeorm';

@Entity({ name: 'FXA_GRPMST', schema: 'WEBFORM' })
export class FXA_GRPMST {
    @PrimaryColumn()
    GRPCODE: string;

    @Column()
    GRPDESC: string;
}
