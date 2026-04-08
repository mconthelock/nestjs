import { Entity, PrimaryColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { QA_FILE } from './QA_FILE.entity';
import { QAINS_OPERATOR_AUDITOR } from './QAINS_OPERATOR_AUDITOR.entity';

@Entity({ name: 'QA_TYPE', schema: 'WEBFORM' })
export class QA_TYPE {
    @PrimaryColumn()
    QAT_CODE: string;

    @Column()
    QAT_TABLE: string;

    @Column()
    QAT_COLUMNCODE: string;

    @Column()
    QAT_NAME: string;

    @Column()
    QAT_DETAIL: string;

    @OneToMany(() => QA_FILE, (f) => f.TYPE)
    FILE_TYPE: QA_FILE[];

    @OneToMany(() => QAINS_OPERATOR_AUDITOR, (o) => o.TYPE)
    QOA_TYPE: QAINS_OPERATOR_AUDITOR[];
}
