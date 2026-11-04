import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PPO', schema: 'AMEC' })
export class PPO {
    @PrimaryColumn()
    SPONO: string;

    @Column()
    DPODATE: Date;

    @Column()
    SREFNO: string;

    @Column()
    SREQUESTER: string;

    @Column()
    SKEY: string;

    @Column()
    SVENDCODE: string;

    @Column()
    SSHIPTO: string;

    @Column()
    SSHIPBY: string;

    @Column()
    SPAYTERM: string;

    @Column()
    STRADETERM: string;

    @Column()
    SDELIVERY: string;

    @Column()
    SBYER: string;

    @Column()
    SACCEPTBY: string;

    @Column()
    DACCEPTDATE: Date;

    @Column()
    CSTATUS: string;

    @Column()
    SCURRENCY: string;

    @Column()
    CINVOICE: string;

    @Column()
    CTAX: string;

    @Column()
    SENAME: string;

    @Column()
    SEADDRESS: string;

    @Column()
    SREF: string;

    @Column()
    CRECEIVE: string;

    @Column()
    CSENTSCM: string;

    @Column()
    DDELIVERY: Date;

    @Column()
    DIMPSCM: Date;

    @Column()
    DSENTSCM: Date;

    @Column()
    CIMPSCMTIME: string;

    @Column()
    CSENTSCMTIME: string;

    @Column()
    SREQUESTDEPT: string;
}
