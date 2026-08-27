import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: 'GPTPH_APPLICANT',
    schema: 'WEBFORM',
})
export class GPTPH_APPLICANT {
    @PrimaryColumn()
    CYEAR2: string;
    @PrimaryColumn()
    NFRMNO: number;
    @PrimaryColumn()
    SEQ_NO: number;
    @Column()
    APPLICANT_TYPE: string;
    @Column()
    EMPCODE: string;
    @Column()
    VISTOR_NAME: string;
    @Column()
    COMPANY_NAME: string;

}