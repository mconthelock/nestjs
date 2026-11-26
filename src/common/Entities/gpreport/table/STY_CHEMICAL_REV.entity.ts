import { AfterLoad, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { STY_CHEMICAL_CONTROL } from './STY_CHEMICAL_CONTROL.entity';
import { formatDate, now } from 'src/common/utils/dayjs.utils';

@Entity({ name: 'STY_CHEMICAL_REV', schema: 'GPREPORT' })
export class STY_CHEMICAL_REV {
    @Column()
    OWNER: string;

    @PrimaryColumn()
    OWNERCODE: string;

    @Column()
    REV: string;

    @Column()
    STATUS: number;

    @Column()
    TYPE: number;

    @Column()
    USER_CREATE: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    USER_UPDATE: string;

    @Column()
    UPDATE_DATE: Date;

    @Column()
    USER_APPROVE: string;

    @Column()
    APPROVE_DATE: Date;

    @OneToMany(() => STY_CHEMICAL_CONTROL, (control) => control.REV)
    CONTROLS: STY_CHEMICAL_CONTROL[];

    APVDATE: string;
    @AfterLoad()
    loadManagerApprove() {
        if (this.APPROVE_DATE) {
            this.APVDATE = formatDate(this.APPROVE_DATE, 'DD MMM YYYY');
        } else {
            this.APVDATE = now('DD MMM YYYY');
        }
    }
}
