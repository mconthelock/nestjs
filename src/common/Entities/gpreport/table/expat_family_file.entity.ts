import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('EXPAT_FAMILY_FILE')
export class ExpatFamilyFile {

    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    FILE_ID: number;

    @PrimaryColumn()
    FID: number;

    @PrimaryColumn()
    FILE_TYPE: string;

    @Column()
    FILE_NAME: string;

    @Column()
    FILE_PATH: string;

    @Column()
    FILE_DATE: Date;

}