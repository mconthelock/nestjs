import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ISOFF_VARIEDOFF', schema: 'WEBFORM' })
export class ISOFF_VARIEDOFF {
    @PrimaryGeneratedColumn()
    OFF_ID: number;

    @Column()
    OFF_DATE: Date;

    @Column()
    OFF_DISPLAYNAME: string;

    @Column()
    OFF_EMPNO: string;

    @Column()
    OFF_USERNAME: string;

    @Column()
    OFF_REASON: number;

    @Column()
    OFF_REASON_TYPE: number;

    @Column()
    OFF_USERCODE: string;

    @Column()
    OFF_CONTROLLER: string;

    @Column()
    OFF_STATUS: string;

    @Column()
    OFF_CREATEDATE: Date;
}
