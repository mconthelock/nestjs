import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('EXPAT_EMPLOYEE_FILE')
export class ExpatEmployeeFile {

    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    FILE_ID: number;

    @PrimaryColumn()
    FILE_TYPE: string;

    @Column()
    FILE_NAME: string;

    @Column()
    FILE_PATH: string;

    @Column()
    FILE_DATE: Date;

}