import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PIS_FILES')
export class PisFiles {
    @PrimaryGeneratedColumn()
    FILES: number;

    @Column()
    SCHDDATE: Date;

    @Column()
    SCHDNUMBER: string;

    @Column()
    SCHDCHAR: string;

    @Column()
    SCHDP: string;

    @Column()
    FILE_ONAME: string;

    @Column()
    FILE_NAME: string;

    @Column()
    FILE_FOLDER: string;

    @Column()
    FILE_TOTALPAGE: number;

    @Column()
    FILE_STATUS: number;

    @Column()
    CREATE_DATE: Date;

    @Column()
    PRINTED_DATE: Date;

    @Column()
    FILE_PRINTEDPAGE: number;
}
