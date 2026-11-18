import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { STY_CHEMICAL_SECTION } from './STY_CHEMICAL_SECTION.entity';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { STY_TYPE } from './STY_TYPE.entity';

@Entity({ name: 'STY_CHEMICAL', schema: 'GPREPORT' })
export class STY_CHEMICAL {
    @PrimaryGeneratedColumn()
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

    SDS_DATE?: string;
    EFF_DATE?: string;

    @AfterLoad()
    formatDates() {
        if (this.RECEIVED_SDS_DATE) {
            this.SDS_DATE = formatDate(this.RECEIVED_SDS_DATE, 'DD-MMM-YY');
        }
        if (this.EFFECTIVE_DATE) {
            this.EFF_DATE = formatDate(this.EFFECTIVE_DATE, 'DD-MMM-YY');
        }
    }

    @OneToMany(() => STY_CHEMICAL_SECTION, (s) => s.MASTER)
    SECTIONS: STY_CHEMICAL_SECTION[];

    @OneToOne(() => STY_TYPE)
    @JoinColumn({ name: 'UN_CLASS', referencedColumnName: 'TYPE_ID' })
    CLASS: STY_TYPE;
}
