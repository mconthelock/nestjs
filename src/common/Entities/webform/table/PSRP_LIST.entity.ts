import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';
import { FORMMST } from './FORMMST.entity';
@Entity({
    name: 'PSRP_LIST',
    schema: 'WEBFORM',
})
export class PSRP_LIST {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    LINEID: number;

    @Column()
    PURCODE: string;

    @Column()
    DESCRIPTION: string;

    @Column()
    DRAWING: string;

    @Column()
    ORDERNO: string;

    @Column()
    ITEMNO: string;

    @Column()
    ADDREESS: string;

    @Column()
    RETURNTO: string;

    @Column()
    QTY: number;

    @Column()
    ISSUECARD: string;

    @Column()
    ISSUESEQ: number;

    @Column()
    PRODUCTION: string;

    @Column()
    REMARK: string;

    @Column()
    ISSUETO: string;

    
}
