import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('IDTAGS_FILES')
export class IdtagFiles {
    @PrimaryGeneratedColumn()
    FILES: number;

    @Column()
    SCHDDATE: Date;

    @Column()
    SCHDNUMBER: string;

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
    FILE_STATUS: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    PRINTED_DATE: Date;
}
