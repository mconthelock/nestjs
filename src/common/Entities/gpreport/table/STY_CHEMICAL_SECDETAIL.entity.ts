import { AfterLoad, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { STY_TYPE } from './STY_TYPE.entity';

@Entity({ name: 'STY_CHEMICAL_SECDETAIL', schema: 'GPREPORT' })
export class STY_CHEMICAL_SECDETAIL {
    @PrimaryColumn()
    OWNER: string;

    @PrimaryColumn()
    OWNERCODE: string;

    @PrimaryColumn()
    AMEC_SDS_ID: number;

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
    FIRE_EQUIPMENT: string;

    @Column()
    EFC_WASTE: number;

    @Column()
    EFC_RESULT: number;

    @Column()
    EFC_REASON: string;

    @Column()
    PUR_CODE: string;

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

    @OneToOne(() => STY_TYPE)
    @JoinColumn({ name: 'CARCINOGENS_TYPE', referencedColumnName: 'TYPE_ID' })
    SWCARCINOGENS_TYPE?: string;

    SWQUANTITY_KG?: number | string;
    SWQUANTITY_TYPE?: string;
    SWLAW?: string;
    SWBEI?: string;
    SWEVM_PARAMETER?: string;
    SWSPECIAL_CONTROLLER?: string;
    SWPPE_EQUIPMENT?: string;
    SWFIRE_EQUIPMENT?: string;
    SWEFC_WASTE?: string;
    SWEFC_RESULT?: string;
    SWEFC_REASON?: string;
    SWPUR_CODE?: string;
    SWVENDOR?: string;
    SWVENDOR_TAX_NO?: string;
    SWVENDOR_ADDRESS?: string;
    SWHAZARDOUS?: string;
    SWCAS_NO?: string;
    SWSUBSTANCE_NAME?: string;
    SWSUBSTANCE_WEIGHT?: string | number;
    SWSUBSTANCE_TYPE?: string | number;
    SWCARCINOGENS?: string | number;
    SWCARCINOGENS_DETAIL?: string;

    @AfterLoad()
    mapQuantityType() {
        this.SWQUANTITY_TYPE = '-';
        this.SWQUANTITY_KG = this.QUANTITY_KG || '-';
        this.SWLAW = this.LAW || '-';
        this.SWBEI = this.BEI || '-';
        this.SWEVM_PARAMETER = this.EVM_PARAMETER || '-';
        this.SWSPECIAL_CONTROLLER = '-';
        this.SWPPE_EQUIPMENT = this.PPE_EQUIPMENT?.replace('|', ', ') || '-';
        this.SWFIRE_EQUIPMENT = this.FIRE_EQUIPMENT?.replace('|', ', ') || '-';
        this.SWEFC_WASTE = '-';
        this.SWEFC_RESULT = '-';
        this.SWEFC_REASON = this.EFC_REASON || '-';
        this.SWPUR_CODE = this.PUR_CODE ? `(${this.PUR_CODE})` : '';
        this.SWVENDOR = this.VENDOR || '-';
        this.SWVENDOR_TAX_NO = this.VENDOR_TAX_NO || '-';
        this.SWVENDOR_ADDRESS = this.VENDOR_ADDRESS || '-';
        this.SWHAZARDOUS = '-';
        this.SWCAS_NO = this.CAS_NO || '-';
        this.SWSUBSTANCE_NAME = this.SUBSTANCE_NAME || '-';
        this.SWSUBSTANCE_WEIGHT = this.SUBSTANCE_WEIGHT || '-';
        this.SWSUBSTANCE_TYPE = this.SUBSTANCE_TYPE || '-';
        this.SWCARCINOGENS = '-';
        this.SWCARCINOGENS_DETAIL = this.CARCINOGENS_DETAIL || '-';
        if (this.QUANTITY_TYPE) {
            this.SWQUANTITY_TYPE =
                this.QUANTITY_TYPE === 1 ? 'kg/วัน' : 'kg/เดือน';
        }
        if (this.HEALTH && this.HEALTH == 0) {
            this.SWBEI = 'ไม่จำเป็น';
        }
        if (this.ENVIRONMENT && this.ENVIRONMENT == 0) {
            this.SWEVM_PARAMETER = 'ไม่จำเป็น';
        }
        if (this.SPECIAL_CONTROLLER) {
            this.SWSPECIAL_CONTROLLER =
                this.SPECIAL_CONTROLLER == 1 ? 'จำเป็น' : 'ไม่จำเป็น';
        }
        if (this.EFC_WASTE) {
            this.SWEFC_WASTE = this.EFC_WASTE == 1 ? 'จำเป็น' : 'ไม่จำเป็น';
        }
        if (this.EFC_RESULT) {
            this.SWEFC_RESULT = this.EFC_RESULT == 1 ? 'ผ่าน' : 'ไม่ผ่าน';
        }
        if (this.HAZARDOUS) {
            this.SWHAZARDOUS = this.HAZARDOUS == 1 ? 'มี' : 'ไม่มี';
        }
        if (this.CARCINOGENS) {
            this.SWCARCINOGENS = this.CARCINOGENS == 1 ? 'มี' : 'ไม่มี';
        }
    }
}
