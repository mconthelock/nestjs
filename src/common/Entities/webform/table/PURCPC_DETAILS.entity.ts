import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PURCPC_FORM } from './PURCPC_FORM.entity';

@Entity({ name: 'PURCPC_DETAILS', schema: 'WEBFORM' })
export class PURCPC_DETAILS {
    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    CMODE: string;

    @Column()
    VMODEL: string;

    @Column()
    VITEM_CODE: string;

    @Column()
    VJOB_ITEMNO: string;

    @Column()
    VSPEC: string;

    @Column()
    VMATERIAL_CODE: string;

    @Column()
    VDRAWING: string;

    @Column()
    VPART_NAME: string;

    @Column({
        type: 'decimal',
    })
    NQUANTITY_YEAR: number;

    @Column()
    VPRES_VENDOR: string;

    @Column()
    VPRES_VENDOR_NAME: string;

    @Column()
    VPRES_MAKER: string;

    @Column({
        type: 'decimal',
    })
    NPRES_BASE_PRICE: number;

    @Column()
    VPRES_BASE_CURR: string;

    @Column({
        type: 'decimal',
    })
    NPRES_PRICE: number;

    @Column()
    VPRES_PRICE_CURR: string;

    @Column({
        type: 'decimal',
    })
    NPRES_PRICE_ETA_AMEC: number;

    @Column({
        type: 'decimal',
    })
    NPRES_AMOUNT: number;

    @PrimaryColumn()
    VNEWITEM_CODE: string;

    @Column()
    VNEWJOB_ITEMNO: string;

    @Column()
    VNEWSPEC: string;

    @Column()
    VNEWMATERIAL_CODE: string;

    @Column()
    VNEWDRAWING: string;

    @Column()
    VNEWPART_NAME: string;

    @Column()
    VNEW_VENDOR: string;

    @Column()
    VNEW_VENDOR_NAME: string;

    @Column()
    VNEW_MAKER: string;

    @Column({
        type: 'decimal',
    })
    NNEW_BASE_PRICE: number;

    @Column()
    VNEW_BASE_CURR: string;

    @Column({
        type: 'decimal',
    })
    NNEW_PRICE: number;

    @Column()
    VNEW_PRICE_CURR: string;

    @Column({
        type: 'decimal',
    })
    NNEW_PRICE_ETA_AMEC: number;

    @Column({
        type: 'decimal',
    })
    NNEW_AMOUNT: number;

    @Column({
        type: 'decimal',
    })
    NCOST_DIFF: number;

    @Column({
        type: 'decimal',
    })
    NCOST_AMOUNT: number;

    @Column({
        type: 'decimal',
    })
    NCOST_RATIO: number;

    @Column()
    CNEW_PRICE_YEAR: string;

    @Column()
    VNEW_PRICE_MONTH: string;

    @Column()
    VOLD_ITEM_COMPARE: string;

    @Column()
    VPLANNER: string;

    @Column({
        type: 'decimal',
    })
    NQTY1: number;

    @Column({
        type: 'decimal',
    })
    NQTY2: number;

    @Column({
        type: 'decimal',
    })
    NQTY3: number;

    @Column({
        type: 'decimal',
    })
    NQTY4: number;

    @Column({
        type: 'decimal',
    })
    NQTY5: number;

    @Column({
        type: 'decimal',
    })
    NQTY6: number;

    @Column({
        type: 'decimal',
    })
    NQTY7: number;

    @Column({
        type: 'decimal',
    })
    NQTY8: number;

    @Column({
        type: 'decimal',
    })
    NPRICE1: number;

    @Column({
        type: 'decimal',
    })
    NPRICE2: number;

    @Column({
        type: 'decimal',
    })
    NPRICE3: number;

    @Column({
        type: 'decimal',
    })
    NPRICE4: number;

    @Column({
        type: 'decimal',
    })
    NPRICE5: number;

    @Column({
        type: 'decimal',
    })
    NPRICE6: number;

    @Column({
        type: 'decimal',
    })
    NPRICE7: number;

    @Column({
        type: 'decimal',
    })
    NPRICE8: number;

    @Column()
    VQUOTATION_NO: string;

    @Column()
    DQUOTATION_DATE: Date;

    @Column()
    DDIMAPV_DATE: Date;

    @Column()
    VCOMMENT: string;

    @ManyToOne(() => PURCPC_FORM, form => form.DETAILS)
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    PURCPC_FORM: PURCPC_FORM;
}
