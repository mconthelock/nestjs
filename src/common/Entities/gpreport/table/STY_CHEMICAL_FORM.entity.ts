import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { FORM } from '../../webform/table/FORM.entity';

@Entity({ name: 'STY_CHEMICAL_FORM', schema: 'GPREPORT' })
export class STY_CHEMICAL_FORM {
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

    @Column()
    OWNER: string;

    @Column()
    OWNERCODE: string;

    @Column()
    AMEC_SDS_ID: number;

    @Column()
    RECEIVED_SDS_DATE: Date;

    @Column()
    EFFECTIVE_DATE: Date;

    @Column()
    CHEMICAL_NAME: string;

    @Column()
    USED_FOR: string;

    @Column()
    USED_AREA: string;

    @Column()
    KEEPING_POINT: string;

    @Column()
    QTY: number;

    @Column()
    QUANTITY_KG: number;

    @Column()
    QUANTITY_TYPE: number;

    @Column()
    LAYOUT_FILE: number;

    @Column()
    LAW: string;

    @Column()
    HEALTH: number;

    @Column()
    BEI: string;

    @Column()
    ENVIRONMENT: number;

    @Column()
    EVM_PARAMETER: string;

    @Column()
    PPE: number;

    @Column()
    PPE_EQUIPMENT: string;

    @Column()
    SPECIAL_CONTROLLER: number;

    @Column()
    FIRE_PROTECT: number;

    @Column()
    FIRE_EQUIPMENT: string;

    @Column()
    EFC_WASTE: number;

    @Column()
    EFC_RESULT: number;

    @Column()
    EFC_REASON: string;

    @Column()
    PUR_INCHARGE: string;

    @Column()
    PRODUCT_CODE: string;

    @Column()
    SDS_FILE: number;

    @Column()
    VENDOR: string;

    @Column()
    VENDOR_ADDRESS: string;

    @Column()
    VENDOR_TAX_NO: string;

    @Column()
    HAZARDOUS: number;

    @Column()
    CAS_NO: string;

    @Column()
    SUBSTANCE_NAME: string;

    @Column()
    SUBSTANCE_WEIGHT: number;

    @Column()
    SUBSTANCE_TYPE: number;

    @Column()
    CARCINOGENS: number;

    @Column()
    CARCINOGENS_DETAIL: string;

    @Column()
    CARCINOGENS_TYPE: number;

    @Column()
    CLASS: number;

    @Column()
    NEW_CHEMICAL: number;

    @Column()
    FORM_TYPE: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    VENDOR_NAME: string;

    @Column()
    PUR_CODE: string;

    @Column()
    REVISION: string;

    @Column()
    USER_CONTROL: string;

    @Column()
    REASON_CANCEL: string;

    @OneToOne(() => FORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO'})
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO'})
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR'})
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2'})
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO'})
    FORM: FORM;
}
