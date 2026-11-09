import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, VirtualColumn } from 'typeorm';
import { STY_CHEMICAL_SECTION } from './STY_CHEMICAL_SECTION.entity';
import { STY_TYPE } from './STY_TYPE.entity';

@Entity({ name: 'STY_CHEMICAL', schema: 'GPREPORT' })
export class STY_CHEMICAL {
    @PrimaryColumn()
    AMEC_SDS_ID: number;

    @Column()
    RECEIVED_SDS_DATE: Date;

    @Column()
    EFFECTIVE_DATE: Date;

    @Column()
    PRODUCT_CODE: string;

    @Column()
    CHEMICAL_NAME: string;

    @Column()
    VENDOR: string;

    @Column()
    PUR_INCHARGE: string;

    @Column()
    UN_CLASS: number;

    @Column()
    REV: string;

    @Column()
    STATUS: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    USER_UPDATE: string;

    @Column()
    UPDATE_DATE: Date;

    @OneToMany(() => STY_CHEMICAL_SECTION, (s) => s.MASTER)
    SECTIONS: STY_CHEMICAL_SECTION[];
}
