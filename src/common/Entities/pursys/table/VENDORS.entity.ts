import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';

@Entity({ name: 'VENDORS', schema: 'PURSYS' })
export class Vendors {
    @PrimaryColumn()
    VND_CODE: string;

    @Column()
    VND_NAME: string;

    @Column()
    VND_REGISTED: Date;

    @Column()
    VND_STATUS: string;

    @Column()
    VND_TERM: string;

    @Column()
    VND_TYPE1: string;

    @Column()
    VND_TYPE2: string;

    @Column()
    VND_CURRENCY: string;

    @Column()
    VND_PAYMENT: string;

    @Column()
    VND_ADDRESS1: string;

    @Column()
    VND_ADDRESS2: string;

    @Column()
    VND_CITY: string;

    @Column()
    VND_STATE: string;

    @Column()
    VND_COUNTRY: string;

    @Column()
    VND_PHONE: string;

    @Column()
    VND_FAX: string;

    @Column()
    VND_CONTACTNAME: string;

    @Column()
    VND_CATEGORY: string;

    @Column()
    VND_BANO: string;

    @Column()
    VND_CANO: string;

    @Column()
    VND_TAXNO: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    CREATE_AT: Date;

    @Column()
    CREATE_BY: string;

    @Column({ onUpdate: 'CURRENT_TIMESTAMP' })
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;

    @OneToMany(() => PURVMM_FORM, (history) => history.VENDER)
    PURVMM: PURVMM_FORM[];
}
