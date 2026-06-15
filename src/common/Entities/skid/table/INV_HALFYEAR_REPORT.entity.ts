import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { INV_HALFYEAR_REPORT_ASSIGN } from './INV_HALFYEAR_REPORT_ASSIGN.entity';
import { PSCIH_FORM } from '../../webform/table/PSCIH_FORM.entity';

@Entity({ name: 'INV_HALFYEAR_REPORT', schema: 'SKIDCNTRL' })
export class INV_HALFYEAR_REPORT {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    STATUS: string;

    @Column()
    CREATED_BY: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @Column({ type: 'date', nullable: true })
    UPDATED_AT: Date;

    @OneToMany(() => INV_HALFYEAR_REPORT_ASSIGN, (f2) => f2.REPORT)
    @JoinColumn([{ name: 'ID', referencedColumnName: 'REPORT_ID' }])
    ASSIGN_LIST: INV_HALFYEAR_REPORT_ASSIGN[];

    @OneToOne(() => PSCIH_FORM, (f3) => f3.REPORT)
    @JoinColumn([{ name: 'ID', referencedColumnName: 'REPORT_ID' }])
    PSCIH_FORM: PSCIH_FORM;

    
}
