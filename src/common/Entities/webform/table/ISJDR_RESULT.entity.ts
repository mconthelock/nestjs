import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISJDR_RESULT', schema: 'WEBFORM' })
export class ISJDR_RESULT {
    @PrimaryColumn()
    RC_SECTION: string;

    @PrimaryColumn()
    RC_DATETIME: Date;

    @PrimaryColumn()
    RC_JOBNO: string;

    @Column()
    RC_ACTION: number;

    @Column()
    RC_CONCERN: number;

    @Column()
    RC_CHECKER: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    RC_CHECKDATE: Date;
}
