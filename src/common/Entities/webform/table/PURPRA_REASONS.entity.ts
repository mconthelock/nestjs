import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { PURPRA_FORM } from "./PURPRA_FORM.entity";
import { PURPRA_REASON_MASTER } from "./PURPRA_REASON_MASTER.entity";

@Entity({name: 'PURPRA_REASONS', schema: 'WEBFORM'})
export class PURPRA_REASONS {
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
    NREASON_ID: number;

    @Column()
    VVALUE?: string;

    @Column()
    VFROM?: string;

    @Column()
    VTO?: string;

    @ManyToOne(() => PURPRA_FORM, (p) => p.REASONS)
    @JoinColumn([
        { name: "NFRMNO", referencedColumnName: "NFRMNO" },
        { name: "VORGNO", referencedColumnName: "VORGNO" },
        { name: "CYEAR", referencedColumnName: "CYEAR" },
        { name: "CYEAR2", referencedColumnName: "CYEAR2" },
        { name: "NRUNNO", referencedColumnName: "NRUNNO" }
    ])
    PURPRA_FORM?: PURPRA_FORM;

    @OneToOne(() => PURPRA_REASON_MASTER)
    @JoinColumn({ name: "NREASON_ID", referencedColumnName: "NID" })
    REASON_MASTER?: PURPRA_REASON_MASTER;
}