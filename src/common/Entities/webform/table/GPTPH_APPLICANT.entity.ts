import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GPTPH_REQ_HEADER } from "./GPTPH_REQ_HEADER.entity";

@Entity({
    name: 'GPTPH_APPLICANT',
    schema: 'WEBFORM',
})
export class GPTPH_APPLICANT {
    @PrimaryColumn()
    CYEAR2: string;
    @PrimaryColumn()
    NRUNNO: number;
    @PrimaryColumn()
    SEQ_NO: number;
    @Column()
    APPLICANT_TYPE: string;
    @Column()
    EMP_CODE: string;
    @Column()
    APPLICANT_NAME: string;
    @Column()
    COMPANY_NAME: string; 


    @ManyToOne(() => GPTPH_REQ_HEADER)
    @JoinColumn([
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: GPTPH_REQ_HEADER;
}