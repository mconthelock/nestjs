import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { INV_HALFYEAR_REPORT } from './INV_HALFYEAR_REPORT.entity';
import { PSCI_FORM } from '../../webform/table/PSCI_FORM.entity';

@Entity({ name: 'INV_HALFYEAR_REPORT_ASSIGN', schema: 'SKIDCNTRL' })
export class INV_HALFYEAR_REPORT_ASSIGN {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    REPORT_ID: number;

    @Column()
    ASSIGN_ID: number;

    @ManyToOne(() => INV_HALFYEAR_REPORT, (f1) => f1.ASSIGN_LIST)
    @JoinColumn([{ name: 'REPORT_ID', referencedColumnName: 'ID' }])
    REPORT: INV_HALFYEAR_REPORT;

    @OneToOne(() => PSCI_FORM, (p) => p.REPORT)
    @JoinColumn([{ name: 'ASSIGN_ID', referencedColumnName: 'ASSIGN_ID' }])
    PSCI_FORM: PSCI_FORM;
}

