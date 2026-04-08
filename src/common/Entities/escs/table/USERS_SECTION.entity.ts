import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { Entity, PrimaryColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { QAINS_FORM } from '../../webform/table/QAINS_FORM.entity';

@Entity({
    name: 'USERS_SECTION',
    schema: 'ESCCHKSHT',
})
export class USERS_SECTION {
    @PrimaryColumn()
    SEC_ID: number;

    @Column()
    SEC_NAME: string;

    @Column({ default: 1 })
    SEC_STATUS: number;

    @Column()
    INCHARGE: string;

    @Column()
    SSECCODE: string;

    @OneToMany(() => ITEM_MFG, (i) => i.USER_SECTION)
    ITEM_MFG: ITEM_MFG[];

    @OneToOne(() => QAINS_FORM, (q) => q.QA_INCHARGE_SECTION_INFO)
    QAINS: QAINS_FORM;
}
